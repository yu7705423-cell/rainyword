// Rainy 单词 · Service Worker
// 注意：必须作为独立的同源文件注册。以前的版本把脚本塞进 blob: URL 注册，
// Chrome 会直接拒绝（"The URL protocol of the script is not supported"），
// 所以离线缓存实际上一直没有生效。
const CACHE_NAME = 'rainy-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

function putSafe(req, res) {
  // 只缓存同源的正常响应：跨域是 opaque 响应，cache.put 会抛错
  if (!res || res.status !== 200 || res.type !== 'basic') return;
  caches.open(CACHE_NAME)
    .then(cache => { try { cache.put(req, res); } catch (e) {} })
    .catch(() => {});
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  // 跨域请求（发音音频、词库镜像）完全不拦截
  if (url.origin !== self.location.origin) return;

  const isDoc = req.mode === 'navigate' ||
                (req.headers.get('accept') || '').indexOf('text/html') >= 0;

  if (isDoc) {
    // 页面本体走网络优先，保证改动能更新到；断网时再退回缓存
    e.respondWith(
      fetch(req)
        .then(res => { putSafe(req, res.clone()); return res; })
        .catch(() => caches.match(req).then(c => c || caches.match('index.html')))
    );
    return;
  }

  // 其它同源资源（词库 JSON 等）：缓存优先，缺失时下载并缓存
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => { putSafe(req, res.clone()); return res; });
    })
  );
});
