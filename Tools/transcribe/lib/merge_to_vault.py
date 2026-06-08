"""Merge transcript files into Obsidian vault notes."""

import re
from pathlib import Path

from whisper_run import Segment, parse_srt_text


TRANSCRIPT_HEADING = "## 逐字转写"
PENDING_BLOCK = (
    TRANSCRIPT_HEADING + "\n"
    "> 状态：待转写。运行 `Tools/transcribe/transcribe.ps1 -Bvid {bvid} -Part {part}` 补充。\n"
)

COURSE_MAP = {
    "BV1ser5BDESU": "数据要素技术",
    "BV127411M7BU": "DSP数字信号处理",
    "BV1Yo5D6TEVk": "SolidWorks-AI自动化",
}


def parse_parts(spec):
    spec = spec.strip()
    if not spec or spec.lower() == "all":
        return []
    parts = []
    for chunk in re.split(r"[,，\s]+", spec):
        chunk = chunk.strip()
        if not chunk:
            continue
        if "-" in chunk:
            a, b = chunk.split("-", 1)
            parts.extend(range(int(a), int(b) + 1))
        else:
            parts.append(int(chunk))
    return sorted(set(parts))


def find_note_path(vault_dir, bvid, part, course=None):
    course = course or COURSE_MAP.get(bvid)
    if not course:
        return None
    course_dir = vault_dir / course
    if not course_dir.exists():
        return None

    p_tag = "p={}".format(part)
    p_tag2 = "p={}&".format(part)
    for md in sorted(course_dir.glob("P*.md")):
        text = md.read_text(encoding="utf-8")
        if bvid in text and (p_tag in text or p_tag2 in text):
            return md
        m = re.match(r"P(\d+)-", md.name)
        if m and int(m.group(1)) == part and bvid in text:
            return md
    for md in sorted(course_dir.glob("P*.md")):
        m = re.match(r"P(\d+)-", md.name)
        if m and int(m.group(1)) == part:
            return md
    return None


def _split_note(text):
    if not text.startswith("---"):
        return "", text
    end = text.find("\n---", 3)
    if end < 0:
        return "", text
    return text[: end + 4], text[end + 4 :].lstrip("\n")


def _patch_frontmatter(fm_block, status, engine):
    if not fm_block:
        fm_block = "---\n---"
    lines = fm_block.splitlines()
    keys = {"transcript_status": status, "transcript_engine": engine}
    out = []
    seen = set()
    for line in lines:
        replaced = False
        for key, val in keys.items():
            if line.startswith("{}:".format(key)):
                out.append("{}: {}".format(key, val) if val else "{}: ".format(key))
                seen.add(key)
                replaced = True
                break
        if not replaced:
            out.append(line)
    if out and out[-1].strip() == "---":
        insert_at = len(out) - 1
    else:
        insert_at = len(out)
    for key, val in keys.items():
        if key not in seen:
            out.insert(insert_at, "{}: {}".format(key, val) if val else "{}: ".format(key))
    return "\n".join(out)


def _fmt_range_ts(sec):
    total = int(sec)
    hh, rem = divmod(total, 3600)
    mm, ss = divmod(rem, 60)
    if hh:
        return "{:02d}:{:02d}:{:02d}".format(hh, mm, ss)
    return "{:02d}:{:02d}".format(mm, ss)


def _join_segment_texts(texts):
    if not texts:
        return ""
    parts = [t.strip() for t in texts if t.strip()]
    if not parts:
        return ""
    merged = parts[0]
    end_punct = "。！？；：…"
    for text in parts[1:]:
        if merged and merged[-1] in end_punct:
            merged += text
        else:
            merged += "，" + text
    if merged and merged[-1] not in end_punct + "，、":
        merged += "。"
    return merged


def _paragraph_title(first_text, max_len=15):
    title = re.sub(r"\s+", "", first_text.strip())
    if len(title) > max_len:
        title = title[:max_len].rstrip("，。、；：")
    return title or "转写片段"


def format_transcript_paragraphs(
    segments,
    silence_gap_s=2.0,
    max_duration_s=240,
    max_chars=250,
    min_chars=150,
):
    """Merge whisper segments into readable paragraphs with section timestamps."""
    paragraphs = []
    current = None

    for seg in segments:
        text = seg.text.strip()
        if not text:
            continue

        if current is None:
            current = {"start": seg.start_s, "end": seg.end_s, "texts": [text]}
            continue

        gap = seg.start_s - current["end"]
        duration = seg.end_s - current["start"]
        char_count = sum(len(t) for t in current["texts"]) + len(text)

        should_break = gap > silence_gap_s
        if not should_break and char_count >= min_chars:
            should_break = duration > max_duration_s or char_count > max_chars

        if should_break:
            paragraphs.append(current)
            current = {"start": seg.start_s, "end": seg.end_s, "texts": [text]}
        else:
            current["texts"].append(text)
            current["end"] = seg.end_s

    if current:
        paragraphs.append(current)

    lines = []
    for para in paragraphs:
        start_ts = _fmt_range_ts(para["start"])
        end_ts = _fmt_range_ts(para["end"])
        title = _paragraph_title(para["texts"][0])
        body = _join_segment_texts(para["texts"])
        lines.append("### [{} - {}] {}".format(start_ts, end_ts, title))
        lines.append(body)
        lines.append("")
    return "\n".join(lines).rstrip()


def read_note_engine(note_path):
    text = note_path.read_text(encoding="utf-8")
    fm, _ = _split_note(text)
    for line in fm.splitlines():
        if line.startswith("transcript_engine:"):
            return line.split(":", 1)[1].strip()
    return "whisper"


def build_transcript_section(segments, engine, bvid, part):
    lines = [
        TRANSCRIPT_HEADING,
        "> 引擎: {} | 状态: 已转写 | 格式: 段落化".format(engine),
        "",
    ]
    lines.append(format_transcript_paragraphs(segments).rstrip())
    return "\n".join(lines) + "\n"


def replace_or_insert_section(body, new_section):
    pattern = re.compile(
        r"^" + re.escape(TRANSCRIPT_HEADING) + r".*?(?=^## |\Z)",
        re.MULTILINE | re.DOTALL,
    )
    if pattern.search(body):
        return pattern.sub(new_section.rstrip() + "\n\n", body, count=1)
    insert_before = [
        "## 来源说明",
        "## 关键截图",
        "## 与前后分 P 的衔接",
        "## 关键术语",
    ]
    for marker in insert_before:
        idx = body.find(marker)
        if idx >= 0:
            return body[:idx].rstrip() + "\n\n" + new_section + "\n" + body[idx:]
    return body.rstrip() + "\n\n" + new_section


def merge_transcript_to_note(note_path, segments, engine, bvid, part, status="已转写"):
    text = note_path.read_text(encoding="utf-8")
    fm, body = _split_note(text)
    section = build_transcript_section(segments, engine=engine, bvid=bvid, part=part)
    body = replace_or_insert_section(body, section)
    fm = _patch_frontmatter(fm, status=status, engine=engine)
    note_path.write_text(fm + "\n\n" + body, encoding="utf-8")


def merge_from_files(vault_dir, bvid, part, srt_path, engine):
    note = find_note_path(vault_dir, bvid, part)
    if not note:
        return None
    segments = parse_srt_text(srt_path.read_text(encoding="utf-8"))
    if not segments:
        txt = srt_path.with_suffix(".txt")
        if txt.exists():
            segments = [Segment(0, 0, ln) for ln in txt.read_text(encoding="utf-8").splitlines() if ln.strip()]
    merge_transcript_to_note(
        note_path=note,
        segments=segments,
        engine=engine,
        bvid=bvid,
        part=part,
    )
    return note


def ensure_pending_sections(vault_dir, bvid, part_count):
    course = COURSE_MAP.get(bvid)
    if not course:
        return 0
    changed = 0
    for part in range(1, part_count + 1):
        note = find_note_path(vault_dir, bvid, part, course)
        if not note or not note.exists():
            continue
        text = note.read_text(encoding="utf-8")
        if TRANSCRIPT_HEADING in text:
            continue
        fm, body = _split_note(text)
        pending = PENDING_BLOCK.format(bvid=bvid, part=part)
        body = replace_or_insert_section(body, pending)
        fm = _patch_frontmatter(fm, status="待转写", engine="")
        note.write_text(fm + "\n\n" + body, encoding="utf-8")
        changed += 1
    return changed
