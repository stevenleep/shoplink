import StoreRepository from '@/models/repository/StoreRepository';
import logger from '@/utils/logger';
import { createShoplineUrl } from '@/utils/request';
import axios from 'axios';
import { Service } from 'typedi';

@Service()
export default class StoreAuthService {
  constructor(private readonly storeRepository: StoreRepository) {}
  public async getToken(
    appkey: string,
    handle: string,
    code: string,
    sign: string,
    timestamp: string | number,
  ) {
    const res = await axios.post(
      `${createShoplineUrl(handle)}/admin/oauth/token/create`,
      { code },
      { headers: { appkey, timestamp, sign } },
    );
    return res.data || {};
  }

  /**
   * 判断是否已经安装并且是最新权限
   */
  public async isInstalledAndLatestAuthScopes(appkey: string, scopes: string[]) {
    const storeInfoFromDB = await this.storeRepository.findOneByAppkey(appkey);
    if (!storeInfoFromDB) return false;

    // 判断是否是最新权限
    const scopesFromDB = storeInfoFromDB.scopes;
    if (scopesFromDB.length !== scopes.length) {
      return false;
    }
    for (let i = 0; i < scopes.length; i++) {
      if (scopes[i] !== scopesFromDB[i]) {
        return false;
      }
    }
    return true;
  }

  // 获取店铺信息
  public async getStoreInfo(handle: string, tokens: any) {
    const apiPath = `${createShoplineUrl(handle)}/admin/openapi/v20250301/merchants/shop.json`;
    const res = await axios
      .get(apiPath, {
        headers: {
          Authorization: tokens.access_token,
          ContentType: 'application/json; charset=utf-8',
        },
      })
      .catch((err) => {
        logger.error('getStoreInfo error', err);
        return { data: { data: {} } };
      });
    return res.data?.data || {};
  }

  public getAndSaveStore(appkey: string, handle: string, tokens: any, scopes: string[]) {
    const storeInfo: any = this.getStoreInfo(handle, tokens);
    const storeValues = {
      appkey,
      handle,
      store_id: storeInfo?.id,
      merchant_id: storeInfo?.merchant_id,
      store_name: storeInfo?.name,
      store: storeInfo,
      scopes,
    };
    return this.storeRepository.saveStore(storeValues);
  }
}
