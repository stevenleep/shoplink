export const SHOPLAZZA_CONFIG = {
    SCOPES: ['read_shop', 'read_script_tags', 'write_script_tags', 'read_app_proxy', 'write_app_proxy'],
    CLIENT_ID: "BpogyeRT0fRq4y2NKMc7WyZD97YvvVoVvLAkQh92Bps",
    CLIENT_SECRET: "K8ZXVdFsCaK8-b5H97WyZEQ5yq3ghDrpT0KeSOX7aOg",
};

export const SHOPLAZZA_APP_SCOPES = SHOPLAZZA_CONFIG.SCOPES;
export const SHOPLAZZA_APP_BASE_URL = process.env.SERVER_URL;
export const SHOPLAZZA_APP_REDIRECT_URI = `${SHOPLAZZA_APP_BASE_URL}/api/shoplazza/auth/callback`;

export const config = {
    manifest_real_path: process.env.SHOPLAZZA_MANIFEST_REAL_PATH,
    manifest_proxy_url: process.env.SHOPLAZZA_MANIFEST_PROXY_URL,

    static_proxy_real_path: process.env.SHOPLAZZA_STATIC_REAL_PATH,
    static_proxy_proxy_url: process.env.SHOPLAZZA_STATIC_PROXY_URL,
};

export default config;