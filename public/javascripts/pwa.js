if (!window.SHOPLAZZA && !window.SHOP_PARAMS) {
  throw new Error('SHOPLAZZA or SHOP_PARAMS is not defined');
}

const shop_id =
  (window.SHOPLAZZA.shop && window.SHOPLAZZA.shop.shop_id) || window.SHOP_PARAMS.shop_id;
const link = document.createElement('link');
link.rel = 'manifest';
link.fetchpriority = 'high';
link.crossOrigin = 'use-credentials';
link.as = 'fetch';
link.href = `/apps/pwa/configs/pwa/manifests/${shop_id}/manifest.json`;

// 将link标签插入到head标签顶部
document.head.appendChild(link);
// 注册service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/apps/pwa/static/static/javascripts/service-worker.js')
    .then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      //   registration.pushManager.getSubscription().then((subscription) => {
      //     if (subscription) {
      //       console.log('已订阅：', subscription);
      //       fetch('https://usually-valid-weevil.ngrok-free.app/api/v1/auth/subscribe', {
      //         method: 'POST',
      //         headers: {
      //           'Content-Type': 'application/json',
      //         },
      //         body: JSON.stringify({
      //           token: subscription,
      //           title: 'Hello',
      //           uniqueid: new Date().getTime(),
      //           body: 'Hello, world!',
      //         }),
      //       })
      //         .then((res) => {
      //           console.log('订阅成功：------>>', res);
      //         })
      //         .catch((err) => {
      //           console.log('订阅失败：', err);
      //         });
      //     } else {
      //       console.log('未订阅');
      //       registration.pushManager
      //         .subscribe({
      //           userVisibleOnly: true,
      //           applicationServerKey:
      //             'BD39eYejet7qna3Fp6hYktB-cBTwfdGS1ThuvOGEEMOgsz2juj-ypmU6-mJCygLI7v_3Bdt5ZdN0w_7qlMGd1sQ',
      //         })
      //         .then((subscription) => {
      //           console.log('订阅成功：', subscription);
      //           // 向服务器发送订阅信息
      //           fetch('https://usually-valid-weevil.ngrok-free.app/api/v1/auth/subscribe', {
      //             method: 'POST',
      //             body: JSON.stringify({
      //               token: subscription,
      //               title: 'Hello',
      //               uniqueid: new Date().getTime(),
      //               body: 'Hello, world!',
      //             }),
      //           })
      //             .then((res) => {
      //               console.log('订阅成功：------>>', res);
      //             })
      //             .catch((err) => {
      //               console.log('订阅失败：', err);
      //             });

      //           return subscription;
      //         })
      //         .catch((err) => {
      //           console.log('订阅失败：', err);
      //         });
      //     }
      //   });
    })
    .catch((err) => {
      console.log('ServiceWorker registration failed: ', err);
    });
}

// 监听 service worker 的消息
navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('Received a message from service worker: ', event.data);
});

// 监听安装
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  console.log('beforeinstallprompt');

  // 显示安装按钮
  const btn = document.createElement('button');
  btn.textContent = '安装';
  document.body.appendChild(btn);
  btn.addEventListener('click', () => {
    window.deferredPrompt.prompt();
    window.deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      window.deferredPrompt = null;
    });
  });
});

// 监听 appinstalled
window.addEventListener('appinstalled', () => {
  console.log('appinstalled');
});

// 监听 service worker 的更新
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});

// 监听 service worker 的消息
navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('Received a message from service worker: ', event.data);
});
