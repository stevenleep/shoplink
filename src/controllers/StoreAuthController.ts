import { Service } from 'typedi';
import { Controller, Get, QueryParams, Req, Res } from 'routing-controllers';
import { StoreAuthModel } from '@/models/interfaces/StoreModel';
import { objectToQueryString } from '@/utils/params';
import { validateSign } from '@/features/sign/shopline';

@Service()
@Controller('/app/:channel/auth')
export class StoreAuthController {
  // Generate a state for store auth
  public genStoreAuthState(handle: string) {
    return Buffer.from(`${handle}_${Date.now()}`).toString('base64');
  }

  // GET   https://{handle}.myshopline.com/admin/oauth-web/#/oauth/authorize?appKey={appKey}&responseType=code&scope={scope}&redirectUri={redirectUri}
  public getStoreRedirectUrl(handle, appKey: string, params: Record<string, string> = {}) {
    const shoplineStoreUrl = `https://${handle}.myshopline.com`;
    const redirectServerBaseUrl = 'https://usually-valid-weevil.ngrok-free.app';
    const paramsStr = objectToQueryString({
      appKey,
      scope: 'write_script_tags,read_script_tags,read_store_information',
      responseType: 'code',
      redirectUri: encodeURIComponent(`${redirectServerBaseUrl}/api/app/shopline/auth/callback`),
      customField: this.genStoreAuthState(handle),
      ...params,
    });
    return `${shoplineStoreUrl}/admin/oauth-web/#/oauth/authorize?${paramsStr}`;
  }

  @Get('/')
  async auth(@QueryParams({ required: true }) query: StoreAuthModel, @Req() req, @Res() res) {
    const { sign, ...resetParams } = query;
    const isValid = validateSign(sign, resetParams);
    if (!isValid) {
      return res.json({ status: 400, data: null, error: 'Invalid sign' });
    }
    res.redirect(302, this.getStoreRedirectUrl(resetParams.handle, resetParams.appkey));
    return res;
  }

  @Get('/callback')
  async authCallback(@Req() req, @Res() res) {
    return res;
  }
}
