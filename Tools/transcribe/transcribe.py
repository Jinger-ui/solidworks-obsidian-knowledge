#!/usr/bin/env python3
"""Bilibili video verbatim transcription pipeline."""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIB = Path(__file__).resolve().parent / "lib"
sys.path.insert(0, str(LIB))

from bili_subtitle_fetch import fetch_subtitle_segments  # noqa: E402
from download_audio import check_download_deps, download_audio  # noqa: E402
from merge_to_vault import (  # noqa: E402
    COURSE_MAP,
    build_transcript_section,
    ensure_pending_sections,
    find_note_path,
    merge_from_files,
    merge_transcript_to_note,
    parse_parts,
    replace_or_insert_section,
)
from whisper_run import (  # noqa: E402
    Segment,
    check_whisper_available,
    parse_srt_text,
    segments_to_markdown,
    segments_to_srt,
    segments_to_txt,
    transcribe_audio,
)


def _utf8_stdio():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def load_config(path):
    path = Path(path)
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {}


def default_config():
    return {
        "whisper_model": "small",
        "whisper_model_dir": str(ROOT / "Downloads" / "whisper-models"),
        "transcript_dir": str(ROOT / "Downloads" / "transcripts"),
        "vault_dir": str(ROOT / "Vault" / "01-视频笔记"),
        "audio_cache_dir": str(ROOT / "Downloads" / "transcripts" / "audio"),
        "vault_courses": COURSE_MAP,
    }


def transcript_dir(cfg, bvid):
    return Path(cfg.get("transcript_dir", default_config()["transcript_dir"])) / bvid


def try_bili_subtitles(bvid, part):
    try:
        segs, engine = fetch_subtitle_segments(bvid, part)
        if not segs:
            return [], "B 站 API 无可用字幕轨"
        return segs, engine
    except Exception as e:
        return [], str(e)


def parse_import_file(path):
    text = path.read_text(encoding="utf-8")
    suffix = path.suffix.lower()
    if suffix == ".json":
        data = json.loads(text)
        body = data.get("body") or data.get("segments") or data
        segs = []
        if isinstance(body, list):
            for item in body:
                if isinstance(item, dict):
                    start = float(item.get("from", item.get("start", item.get("start_s", 0))))
                    end = float(item.get("to", item.get("end", item.get("end_s", start))))
                    content = str(item.get("content", item.get("text", ""))).strip()
                    if content:
                        segs.append(Segment(start, end, content))
        return segs
    if suffix in {".srt", ".vtt"}:
        return parse_srt_text(text.replace(".", ",", 1) if suffix == ".vtt" else text)
    if suffix == ".md":
        segs = []
        for line in text.splitlines():
            m = re.match(r"^-\s*\*\*\[(\d{1,2}:\d{2}(?::\d{2})?)\]\*\*\s*(.+)$", line.strip())
            if m:
                segs.append(Segment(_ts_to_sec(m.group(1)), _ts_to_sec(m.group(1)), m.group(2)))
            elif line.strip() and not line.startswith("#"):
                segs.append(Segment(0, 0, line.strip()))
        return segs
    return [Segment(0, 0, ln) for ln in text.splitlines() if ln.strip()]


def _ts_to_sec(ts):
    parts = [int(x) for x in ts.split(":")]
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    return parts[0] * 3600 + parts[1] * 60 + parts[2]


def save_outputs(segs, out_base):
    out_base.parent.mkdir(parents=True, exist_ok=True)
    srt_path = out_base.with_suffix(".srt")
    txt_path = out_base.with_suffix(".txt")
    srt_path.write_text(segments_to_srt(segs), encoding="utf-8")
    txt_path.write_text(segments_to_txt(segs), encoding="utf-8")
    return srt_path, txt_path


def cmd_check(_):
    deps = check_download_deps(ROOT)
    ok_whisper, whisper_msg = check_whisper_available()
    print("=== 逐字转写环境检测 ===")
    print(f"Python: {sys.version.split()[0]} ({sys.executable})")
    print(f"ffmpeg: {deps['ffmpeg'] or '未安装'}")
    print(f"BBDown: {deps['bbdown'] or '未安装'}")
    print(f"yt-dlp: {deps['yt_dlp'] or '未安装'}")
    print(f"faster-whisper: {'可用' if ok_whisper else whisper_msg}")
    print(f"项目根目录: {ROOT}")
    return 0


def cmd_init_vault(args):
    cfg = {**default_config(), **load_config(args.config)}
    vault = Path(cfg["vault_dir"])
    counts = {
        "BV1ser5BDESU": 47,
        "BV127411M7BU": 44,
        "BV1Yo5D6TEVk": 6,
    }
    total = 0
    for bvid, n in counts.items():
        n_changed = ensure_pending_sections(vault, bvid, n)
        print(f"[OK] {bvid}: 新增 {n_changed} 篇「逐字转写」占位")
        total += n_changed
    print(f"合计更新 {total} 篇笔记")
    return 0


def cmd_demo_merge(args):
    cfg = {**default_config(), **load_config(args.config)}
    bvid = args.bvid or "BV1ser5BDESU"
    part = int(args.part or 1)
    vault = Path(cfg["vault_dir"])
    tdir = transcript_dir(cfg, bvid)
    tdir.mkdir(parents=True, exist_ok=True)
    out_base = tdir / f"P{part:02d}"

    demo_segs = [
        Segment(0.0, 12.5, "大家好，欢迎来到数据要素流通技术系列课程。"),
        Segment(12.5, 28.0, "本集我们将解读国家数据相关政策，围绕供得出、流得动、用得好、保安全四个原则展开。"),
        Segment(28.0, 45.0, "数据二十条明确了数据作为第五大生产要素的基础制度框架。"),
        Segment(45.0, 62.0, "后续课程会在此基础上介绍隐私计算与 SecretFlow 技术栈。"),
    ]
    srt_path, _ = save_outputs(demo_segs, out_base)
    note = merge_from_files(vault_dir=vault, bvid=bvid, part=part, srt_path=srt_path, engine="demo")
    if note:
        print(f"[OK] Demo 已合并到: {note}")
    else:
        print("[WARN] 未找到对应 Vault 笔记")
    return 0 if note else 1


def process_part(args, part):
    cfg = {**default_config(), **load_config(args.config)}
    bvid = args.bvid
    engine = (args.engine or cfg.get("engine") or "auto").lower()
    vault = Path(cfg["vault_dir"])
    tdir = transcript_dir(cfg, bvid)
    out_base = tdir / f"P{part:02d}"

    if args.import_path:
        imp = Path(args.import_path)
        if not imp.is_absolute():
            imp = ROOT / imp
        segs = parse_import_file(imp)
        engine = "bilinote"
    elif engine == "bilinote":
        guide = Path(__file__).parent / "lib" / "bilinote_guide.md"
        print(f"[INFO] bilinote 模式：请按指引操作后使用 -ImportPath 导入")
        print(f"       详见 {guide}")
        return False
    else:
        segs = []
        used_engine = engine

        if engine in ("auto", "bilibili"):
            segs, used_engine = try_bili_subtitles(bvid, part)
            if segs:
                print("[OK] 使用 B 站字幕 ({})，共 {} 段".format(used_engine, len(segs)))
            elif engine == "auto":
                print("[INFO] B 站字幕不可用: {}".format(used_engine))

        if not segs and engine in ("auto", "whisper"):
            ok, msg = check_whisper_available()
            if not ok:
                print(f"[WARN] Whisper 不可用: {msg}")
                if engine == "whisper":
                    return False
            else:
                audio_dir = Path(cfg.get("audio_cache_dir", default_config()["audio_cache_dir"]))
                audio, dl_msg = download_audio(
                    bvid=bvid,
                    part=part,
                    out_dir=audio_dir,
                    project_root=ROOT,
                )
                if not audio:
                    print(f"[WARN] 音频下载失败: {dl_msg}")
                    if engine == "whisper":
                        return False
                else:
                    print(f"[INFO] 音频: {audio} ({dl_msg})")
                    model = cfg.get("whisper_model", "small")
                    model_dir = Path(cfg.get("whisper_model_dir", default_config()["whisper_model_dir"]))
                    print(f"[INFO] Whisper 转写中（{model}，首次会下载模型）…")
                    segs = transcribe_audio(audio, model_size=model, model_dir=model_dir)
                    used_engine = "whisper"
                    print(f"[OK] Whisper 完成，共 {len(segs)} 段")

        if not segs:
            print(f"[FAIL] P{part:02d} 未能获取转写（engine={engine}）")
            return False
        engine = used_engine

    srt_path, txt_path = save_outputs(segs, out_base)
    print(f"[OK] 已保存: {srt_path}")
    print(f"[OK] 已保存: {txt_path}")

    note = merge_from_files(vault_dir=vault, bvid=bvid, part=part, srt_path=srt_path, engine=engine)
    if note:
        print(f"[OK] 已合并 Vault: {note}")
    else:
        print("[WARN] 未找到 Vault 笔记，转写文件已保存在 Downloads/transcripts/")
    return True


def main():
    _utf8_stdio()
    parser = argparse.ArgumentParser(description="B 站视频逐字转写流水线")
    parser.add_argument("--config", default=str(Path(__file__).parent / "config.json"))
    sub = parser.add_subparsers(dest="cmd")

    p_check = sub.add_parser("check", help="检测环境依赖")
    p_check.set_defaults(func=cmd_check)

    p_init = sub.add_parser("init-vault", help="为三门课程笔记批量添加逐字转写占位")
    p_init.set_defaults(func=cmd_init_vault)

    p_demo = sub.add_parser("demo-merge", help="用示例转写演示合并到 Vault")
    p_demo.add_argument("--bvid", default="BV1ser5BDESU")
    p_demo.add_argument("--part", default="1")
    p_demo.set_defaults(func=cmd_demo_merge)

    p_run = sub.add_parser("run", help="执行转写")
    p_run.add_argument("--bvid", required=True)
    p_run.add_argument("--parts", default="1", help="如 1 或 1-5 或 1,3,5")
    p_run.add_argument("--engine", default="auto", choices=["auto", "whisper", "bilinote", "bilibili"])
    p_run.add_argument("--import-path", default="", help="BiliNote/外部 SRT 导入路径")
    p_run.set_defaults(func=None)

    args = parser.parse_args()
    if args.cmd == "check":
        return cmd_check(args)
    if args.cmd == "init-vault":
        return cmd_init_vault(args)
    if args.cmd == "demo-merge":
        return cmd_demo_merge(args)
    if args.cmd == "run":
        parts = parse_parts(args.parts)
        if not parts:
            print("请指定 --parts")
            return 1
        ok_any = False
        for part in parts:
            print(f"\n=== {args.bvid} P{part:02d} ===")
            ns = argparse.Namespace(
                bvid=args.bvid,
                part=part,
                engine=args.engine,
                config=args.config,
                import_path=args.import_path,
            )
            if process_part(ns, part):
                ok_any = True
        return 0 if ok_any else 1

    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
