import axios from 'axios';
import { SHOPLAZZA_APP_REDIRECT_URI, SHOPLAZZA_CONFIG } from "@/config/shoplazza";

export default class ShoplazzaService {
    constructor() { }
    public async getStoreAccessToken(shop, code) {
        const BASE_URL = `https://${shop}`;
        const url = `${BASE_URL}/admin/oauth/token`;
        const data = {
            client_id: SHOPLAZZA_CONFIG.CLIENT_ID,
            client_secret: SHOPLAZZA_CONFIG.CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            SHOPLAZZA_APP_REDIRECT_URI,
        };
        const response = await axios.post(url, data);
        const { access_token } = response.data;

        if (access_token) {
            const token = { 'access-token': access_token };
            // 将店铺和访问令牌保存到数据库，以便后续使用
            return token;
        }

        return null;
    }
}