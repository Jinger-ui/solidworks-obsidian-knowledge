/**
 * Bilibili metadata fetcher - no API key required
 * Fetches video info, tags, player data, downloads first_frame thumbnails
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BV = process.argv[2] || 'BV1Yo5D6TEVk';
const OUT_DIR = process.argv[3] || path.join(__dirname, '..', '..', 'Downloads', 'bili-fetch');
const IMG_DIR = process.argv[4] || path.join(__dirname, '..', '..', 'Vault', '06-资源附件', 'video-notes-images');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.bilibili.com' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(dest); });
    }).on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
  });
}

function fmtDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}分${String(s).padStart(2, '0')}秒`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const view = await fetchJson(`https://api.bilibili.com/x/web-interface/view?bvid=${BV}`);
  if (view.code !== 0) throw new Error(`view API: ${view.message}`);
  const d = view.data;

  const tags = await fetchJson(`https://api.bilibili.com/x/tag/archive/tags?aid=${d.aid}`);
  const tagNames = (tags.data || []).map((t) => t.tag_name);

  const parts = [];
  for (const page of d.pages) {
    const player = await fetchJson(
      `https://api.bilibili.com/x/player/v2?cid=${page.cid}&bvid=${BV}`
    );
    const sub = player.data?.subtitle || {};
    const subtitles = sub.subtitles || [];
    const imgName = `${BV}-P${String(page.page).padStart(2, '0')}-cover.jpg`;
    const imgPath = path.join(IMG_DIR, imgName);
    if (page.first_frame) {
      try {
        await downloadFile(page.first_frame, imgPath);
      } catch (e) {
        console.error(`  cover P${page.page} failed:`, e.message);
      }
    }
    parts.push({
      page: page.page,
      cid: page.cid,
      part: page.part,
      duration_sec: page.duration,
      duration_fmt: fmtDuration(page.duration),
      first_frame: page.first_frame,
      cover_local: imgName,
      subtitle_count: subtitles.length,
      need_login_subtitle: player.data?.need_login_subtitle || false,
      subtitles: subtitles.map((s) => ({
        lan: s.lan_doc || s.lan,
        url: s.subtitle_url,
        ai_type: s.ai_type,
      })),
    });
    await new Promise((r) => setTimeout(r, 300));
  }

  const result = {
    bvid: BV,
    aid: d.aid,
    title: d.title,
    desc: d.desc,
    up: d.owner.name,
    up_mid: d.owner.mid,
    pubdate: d.pubdate,
    total_duration_sec: d.duration,
    total_duration_fmt: fmtDuration(d.duration),
    stat: d.stat,
    tags: tagNames,
    season: d.ugc_season?.title || '',
    parts,
    fetched_at: new Date().toISOString(),
    subtitle_status: parts.every((p) => p.subtitle_count === 0)
      ? '无外挂字幕轨（视频为内嵌配音字幕，API 返回空列表）'
      : '部分分P有字幕',
  };

  const outFile = path.join(OUT_DIR, `${BV}-full.json`);
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
  console.log(JSON.stringify(result, null, 2));
  console.error(`\nSaved: ${outFile}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
