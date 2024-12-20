// 这是一个 service-worker.js 文件，它是一个用于实现 PWA 的核心文件。在这个文件中，我们可以监听 install、activate、fetch 等事件，实现离线缓存、消息推送等功能。

const cacheName = 'pwa-demo';
const filesToCache = [
  '/',
  '/index.html',
  '/stylesheets/style.css',
  '/javascripts/pwa.js'
];

// 监听 install 事件
self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
});

// 监听 activate 事件
self.addEventListener('activate', e => {
    console.log('[ServiceWorker] Activate');
    return self.clients.claim();
});

// 监听服务端的消息推送事件
self.addEventListener('push', e => {
    const value = e.data.json();
  console.log('[ServiceWorker] Push', value);
    // 发送消息给客户端
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage(value);
        });
    });
});

// 监听 fetch 事件
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
