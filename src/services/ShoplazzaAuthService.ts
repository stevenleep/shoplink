import axios from 'axios';
import { SHOPLAZZA_APP_REDIRECT_URI, SHOPLAZZA_CONFIG } from "@/config/shoplazza";
import { Service } from 'typedi';

@Service()
export default class ShoplazzaService {
    public async getAccessToken(shop: string, code: string) {
        const url = `https://${shop}/admin/oauth/token`;
        const data = {
            client_id: SHOPLAZZA_CONFIG.CLIENT_ID,
            client_secret: SHOPLAZZA_CONFIG.CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: SHOPLAZZA_APP_REDIRECT_URI,
        };
        const response = await axios.post(url, data).catch((error) => {
            return { data: {} };
        });

        const { access_token } = response.data;

        if (access_token) {
            return access_token;
        }

        return null;
    }
}