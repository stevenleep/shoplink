import { Service } from 'typedi';
import axios, { AxiosRequestConfig } from 'axios';

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
    };
  }

  /**
   * @title 创建多个App Proxy Config
   * @param appProxyConfigs { real_path: string; proxy_url: string }[]
   * @returns Promise<{
   *    isFailed: boolean;
   *    isSucceed: boolean;
   *    successTotal: number;
   *    failedTotal: number;
   *    failedReasons: any[];
   *    successResults: any[];
   *    failedResults: any[];
   * }>
   */
  async createMany(appProxyConfigs: { real_path: string; proxy_url: string }[]) {
    return Promise.allSettled(appProxyConfigs.map((appProxyConfig) => this.create(appProxyConfig)))
      .then((results) => {
        const successResults = results.filter((result) => result.status === 'fulfilled');
        const failedResults = results.filter((result) => result.status === 'rejected');
        const failedReasons = failedResults.map((result) => result.reason);
        const failedTotal = failedResults.length;
        const successTotal = successResults.length;
        return {
          isFailed: failedTotal > 0,
          isSucceed: successTotal === appProxyConfigs.length,
          successTotal,
          failedTotal,
          failedReasons,
          successResults,
          failedResults,
        };
      })
      .catch((error) => {
        return {
          successTotal: 0,
          isFailed: true,
          isSucceed: false,
          failedTotal: appProxyConfigs.length,
          failedReasons: [error],
          successResults: [],
          failedResults: appProxyConfigs.map((appProxyConfig) => {
            return { status: 'rejected', reason: error, value: appProxyConfig };
          }),
        };
      });
  }

  async create(appProxyConfig: { real_path: string; proxy_url: string }) {
    return axios.post(`https://${this.shop}${this.apiPath}`, appProxyConfig, this.requestConfig);
  }

  async delete(appProxyId: string) {
    return axios.delete(`https://${this.shop}${this.apiPath}/${appProxyId}`, this.requestConfig);
  }

  async getById(appProxyId: string) {
    return axios.get(`https://${this.shop}${this.apiPath}/${appProxyId}`, this.requestConfig);
  }
}
