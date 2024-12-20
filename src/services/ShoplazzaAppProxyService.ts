import { Service } from "typedi";
import axios, { AxiosRequestConfig } from "axios";

@Service()
export default class ShoplazzaAppProxyService {
    public apiPath: string = '/openapi/2022-01/app-proxies';

    public shop: string = '';
    public accessToken: string = '';
    public requestConfig: AxiosRequestConfig = {};

    public setContext(shop, accessToken) {
        this.shop = shop;
        this.accessToken = accessToken;
        this.requestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'access-token': this.accessToken,
            },
        }
    }

    async create(appProxyConfig: { real_path: string, proxy_url: string }) {
        console.log('appProxyConfig ====>', appProxyConfig, this.shop, this.apiPath, this.requestConfig);
        return axios.post(`https://${this.shop}${this.apiPath}`, appProxyConfig, this.requestConfig)
    }

    async delete(appProxyId: string) {
        return axios.delete(`https://${this.shop}${this.apiPath}/${appProxyId}`, this.requestConfig)
    }

    async getById(appProxyId: string) {
        return axios.get(`https://${this.shop}${this.apiPath}/${appProxyId}`, this.requestConfig)
    }
}