"""Minimal Bilibili subtitle fetch (stdlib only, Python 3.6+)."""

import json
import re
import urllib.request

from whisper_run import Segment, parse_srt_text


def _get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Referer": "https://www.bilibili.com"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_cid(bvid, part=1):
    data = _get_json("https://api.bilibili.com/x/web-interface/view?bvid={}".format(bvid))
    if data.get("code") != 0:
        raise RuntimeError(data.get("message", "view API error"))
    for page in data["data"].get("pages", []):
        if int(page.get("page", 0)) == int(part):
            return int(page["cid"])
    raise ValueError("part {} not found".format(part))


def fetch_subtitle_segments(bvid, part=1):
    cid = get_cid(bvid, part)
    player = _get_json(
        "https://api.bilibili.com/x/player/v2?cid={}&bvid={}".format(cid, bvid)
    )
    sub = (player.get("data") or {}).get("subtitle") or {}
    subtitles = sub.get("subtitles") or []
    if not subtitles:
        return [], "bilibili_api"

    # prefer zh-CN / ai-zh
    picked = subtitles[0]
    for item in subtitles:
        lan = (item.get("lan") or "").lower()
        if "zh" in lan:
            picked = item
            break

    sub_url = picked.get("subtitle_url") or picked.get("url") or ""
    if sub_url.startswith("//"):
        sub_url = "https:" + sub_url
    if not sub_url:
        return [], "bilibili_api"

    req = urllib.request.Request(sub_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read().decode("utf-8")

    if sub_url.lower().endswith(".srt"):
        return parse_srt_text(raw), "bilibili_api"

    try:
        data = json.loads(raw)
    except ValueError:
        return parse_srt_text(raw), "bilibili_api"

    segs = []
    body = data.get("body") or []
    for item in body:
        if not isinstance(item, dict):
            continue
        start = float(item.get("from", 0))
        end = float(item.get("to", start))
        text = str(item.get("content", "")).strip()
        if text:
            segs.append(Segment(start, end, text))
    engine = "bilibili_ai_subtitle" if "ai" in (picked.get("lan") or "").lower() else "bilibili_api"
    return segs, engine
