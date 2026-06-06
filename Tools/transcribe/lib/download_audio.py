"""Download Bilibili audio via BBDown or yt-dlp."""

import json
import shutil
import subprocess
import urllib.request
from pathlib import Path


def _run(cmd, timeout=3600):
    return subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )


def find_bbdown(root):
    candidates = [
        root / "Tools" / "BBDown.exe",
        shutil.which("BBDown"),
    ]
    for c in candidates:
        if c and Path(c).exists():
            return Path(c)
    return None


def find_ytdlp():
    for name in ("yt-dlp", "yt-dlp.exe"):
        p = shutil.which(name)
        if p:
            return p
    return None


def find_ffmpeg():
    return shutil.which("ffmpeg")


def fetch_bvid_meta(bvid):
    url = f"https://api.bilibili.com/x/web-interface/view?bvid={bvid}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    if data.get("code") != 0:
        raise RuntimeError(f"Bilibili view API: {data.get('message')}")
    return data["data"]


def get_page_cid(meta, part):
    for page in meta.get("pages", []):
        if int(page.get("page", 0)) == part:
            return int(page["cid"])
    raise ValueError(f"分 P {part} 不存在（共 {len(meta.get('pages', []))} P）")


def download_audio(
    *,
    bvid: str,
    part: int,
    out_dir: Path,
    project_root: Path,
    prefer_bbdown: bool = True,
):
    """Return (audio_path, method_or_error)."""
    out_dir.mkdir(parents=True, exist_ok=True)
    stem = f"{bvid}-P{part:02d}"
    wav_path = out_dir / f"{stem}.wav"
    if wav_path.exists() and wav_path.stat().st_size > 1000:
        return wav_path, "cache"

    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        return None, "未找到 ffmpeg，请先安装（见 README）"

    video_url = f"https://www.bilibili.com/video/{bvid}?p={part}"

    if prefer_bbdown:
        bbdown = find_bbdown(project_root)
        if bbdown:
            tmp = out_dir / f"{stem}_bbdown"
            tmp.mkdir(parents=True, exist_ok=True)
            cmd = [
                str(bbdown),
                video_url,
                "--audio-only",
                "--encoding-priority",
                "aac",
                "-oa",
                str(tmp),
                "-o",
                f"{stem}.%(ext)s",
            ]
            proc = _run(cmd)
            if proc.returncode == 0:
                for ext in (".m4a", ".aac", ".mp3", ".flac", ".wav"):
                    src = tmp / f"{stem}{ext}"
                    if src.exists():
                        return _to_wav(src, wav_path, ffmpeg), "bbdown"
            err = (proc.stderr or proc.stdout or "BBDown 失败").strip()[-500:]

    ytdlp = find_ytdlp()
    if ytdlp:
        raw = out_dir / f"{stem}.%(ext)s"
        cmd = [
            ytdlp,
            "-f",
            "bestaudio/best",
            "-o",
            str(raw),
            "--no-playlist",
            video_url,
        ]
        proc = _run(cmd)
        if proc.returncode == 0:
            for f in out_dir.glob(f"{stem}.*"):
                if f.suffix.lower() in {".m4a", ".aac", ".mp3", ".flac", ".wav", ".webm", ".opus"}:
                    return _to_wav(f, wav_path, ffmpeg), "yt-dlp"
        err = (proc.stderr or proc.stdout or "yt-dlp 失败").strip()[-500:]
    else:
        err = "未找到 BBDown 或 yt-dlp"

    return None, err


def _to_wav(src, dst, ffmpeg):
    if src.suffix.lower() == ".wav" and src != dst:
        shutil.copy2(src, dst)
        return dst
    if src == dst:
        return dst
    cmd = [
        ffmpeg,
        "-y",
        "-i",
        str(src),
        "-ac",
        "1",
        "-ar",
        "16000",
        str(dst),
    ]
    proc = _run(cmd, timeout=7200)
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg 转码失败: {(proc.stderr or '')[-300:]}")
    return dst


def check_download_deps(project_root):
    return {
        "ffmpeg": find_ffmpeg(),
        "bbdown": str(find_bbdown(project_root) or ""),
        "yt_dlp": find_ytdlp() or "",
    }
