"""faster-whisper transcription helpers."""

import re
from pathlib import Path


class Segment(object):
    __slots__ = ("start_s", "end_s", "text")

    def __init__(self, start_s, end_s, text):
        self.start_s = start_s
        self.end_s = end_s
        self.text = text


def check_whisper_available():
    try:
        import faster_whisper  # noqa: F401
    except ImportError:
        return False, "未安装 faster-whisper，请运行: pip install -r Tools/transcribe/requirements.txt"
    return True, "ok"


def segments_to_srt(segments):
    def fmt(sec):
        total_ms = max(0, int(round(sec * 1000)))
        hh = total_ms // 3600000
        mm = (total_ms % 3600000) // 60000
        ss = (total_ms % 60000) // 1000
        ms = total_ms % 1000
        return "{:02d}:{:02d}:{:02d},{:03d}".format(hh, mm, ss, ms)

    lines = []
    for i, seg in enumerate(segments, start=1):
        lines.append(str(i))
        lines.append("{} --> {}".format(fmt(seg.start_s), fmt(seg.end_s)))
        lines.append(seg.text.strip())
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def segments_to_txt(segments):
    return "\n".join(s.text.strip() for s in segments if s.text.strip()) + "\n"


def segments_to_markdown(segments):
    lines = []
    for seg in segments:
        ts = _fmt_link_ts(seg.start_s)
        text = seg.text.strip()
        if text:
            lines.append("- **[{}]** {}".format(ts, text))
    return "\n".join(lines) + ("\n" if lines else "")


def _fmt_link_ts(sec):
    total = int(sec)
    hh, rem = divmod(total, 3600)
    mm, ss = divmod(rem, 60)
    if hh:
        return "{:02d}:{:02d}:{:02d}".format(hh, mm, ss)
    return "{:02d}:{:02d}".format(mm, ss)


def parse_srt_text(text):
    blocks = re.split(r"\n\s*\n", text.strip())
    segments = []
    for block in blocks:
        lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
        if len(lines) < 2:
            continue
        time_line = lines[1] if lines[0].isdigit() else lines[0]
        body_lines = lines[2:] if lines[0].isdigit() else lines[1:]
        m = re.match(
            r"(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})",
            time_line,
        )
        if not m:
            continue

        def to_sec(h, mi, s, ms):
            return int(h) * 3600 + int(mi) * 60 + int(s) + int(ms) / 1000.0

        start = to_sec(m.group(1), m.group(2), m.group(3), m.group(4))
        end = to_sec(m.group(5), m.group(6), m.group(7), m.group(8))
        segments.append(Segment(start, end, "\n".join(body_lines)))
    return segments


def transcribe_audio(audio_path, model_size="small", model_dir=None, language="zh"):
    from faster_whisper import WhisperModel

    model_dir = Path(model_dir or ".")
    model_dir.mkdir(parents=True, exist_ok=True)
    model = WhisperModel(
        model_size,
        device="cpu",
        compute_type="int8",
        download_root=str(model_dir),
    )
    segs, _info = model.transcribe(
        str(audio_path),
        language=language,
        vad_filter=True,
        beam_size=5,
    )
    out = []
    for s in segs:
        out.append(Segment(float(s.start), float(s.end), s.text or ""))
    return out
