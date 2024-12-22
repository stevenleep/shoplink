export function createManifestJSONConfig(config = {}) {
  return {
    name: '',
    short_name: '',
    start_url: '/?from=homescreen',
    icons: [
      {
        src: '/apps/pwa/static/static/images/android-launchericon-192-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apps/pwa/static/static/images/android-launchericon-512-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1976d2',
    orientation: 'portrait',
    scope: '/',
    description: '',
    dir: 'ltr',
    lang: 'zh-CN',
    prefer_related_applications: false,
    related_applications: [],
    screenshots: [],
    categories: [],
    ...config,
  };
}

export function genManifestJSONBolb(config = {}) {
  return Buffer.from(JSON.stringify(config, null, 2), 'utf-8');
}
