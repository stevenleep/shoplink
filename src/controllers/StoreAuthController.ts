import { Service } from 'typedi';
import { Controller, Get, QueryParams, Res } from 'routing-controllers';
import { StoreAuthModel } from '@/models/interfaces/StoreModel';
import { objectToQueryString } from '@/utils/params';
import { genSignMetainfo, validateSign } from '@/features/sign/shopline';
import StoreAuthService from '@/services/StoreAuthService';
import logger from '@/utils/logger';
import { createShoplineUrl } from '@/utils/request';

const scopes = ['write_script_tags', 'read_script_tags', 'read_store_information'];

@Service()
@Controller('/app/:channel/auth')
export class StoreAuthController {
  constructor(private readonly storeAuthService: StoreAuthService) {}

  /**
   * 生成一个随机的state用于防治CSRF攻击
   * @param {string} handle 店铺的handle
   * @returns {string} state
   */
  public genStoreAuthState(handle: string) {
    return Buffer.from(`${handle}_${Date.now()}`).toString('base64');
  }

  /**
   * 生成店铺授权链接，用于跳转到店铺授权页面
   * @param {string} handle 店铺的handle
   * @param {string} appKey 应用的appKey
   * @param {object} params 其他参数
   * @returns
   */
  public getStoreRedirectUrl(handle, appKey: string, params: Record<string, string> = {}) {
    const shoplineStoreUrl = createShoplineUrl(handle);
    const redirectServerBaseUrl = 'https://usually-valid-weevil.ngrok-free.app';
    const paramsStr = objectToQueryString({
      appKey,
      scope: scopes.join(','),
      responseType: 'code',
      redirectUri: encodeURI(`${redirectServerBaseUrl}/api/app/shopline/auth/callback`),
      ...params,
    });
    return `${shoplineStoreUrl}/admin/oauth-web/#/oauth/authorize?${paramsStr}`;
  }

  @Get('/')
  async auth(@QueryParams({ required: true }) query: StoreAuthModel, @Res() res: any) {
    const { sign, ...resetParams } = query;
    const isValid = validateSign(sign, resetParams);
    if (!isValid) {
      return res.json({ status: 400, data: null, error: 'Invalid sign' });
    }

    const { appkey, handle } = resetParams;

    // appkey 为 shopline 体系下店铺的唯一标识
    // 判断已经安装并是最新权限
    if (await this.storeAuthService.isInstalledAndLatestAuthScopes(appkey, scopes)) {
      res.redirect(302, this.getHomeUrl(appkey, handle));
      return res;
    }
    res.redirect(302, this.getStoreRedirectUrl(handle, appkey));
    return res;
  }

  @Get('/callback')
  async authCallback(@QueryParams() query, @Res() res) {
    const { sign, ...resetParams } = query;

    // FIXME: 当前签名校验存在一些问题暂时停用，后续修复后再开启
    const isValid = validateSign(sign, resetParams);
    if (!isValid) {
      logger.error('Invalid sign');
      // return res.json({ status: 400, data: null, error: 'Invalid sign' });
    }

    const { appkey, handle, code } = resetParams;
    const { timestamp, sign: newSign } = genSignMetainfo({ code });
    const tokens = await this.storeAuthService.getToken(appkey, handle, code, newSign, timestamp);

    // save tokens and store info to db
    await this.storeAuthService.getAndSaveStore(appkey, handle, tokens, scopes);

    // redirect to home page
    res.redirect(302, this.getHomeUrl(appkey, handle));
    return res;
  }

  private getHomeUrl(appkey: string, handle: string) {
    return `/app/${appkey}/dashboard/${appkey}?handle=${handle}&timestamp=${Date.now()}`;
  }
}
