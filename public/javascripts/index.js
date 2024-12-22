document.addEventListener('DOMContentLoaded', function () {
  const enableBtn = document.querySelector('#enable');
  enableBtn.addEventListener('click', function () {
    fetch('/api/pwa/manifest/1037526', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        enabled: true,
        manifest: {
          name: 'Shoplazza App',
          version: '1.0.0',
          api_key: '123456',
          scopes: ['read_products', 'write_products'],
          callback_url: 'https://shoplazza-app.herokuapp.com/api/shoplazza/callback',
          enabled: true,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
