import { Service } from "typedi";
import { Controller, Get, Req, Res } from "routing-controllers";
import ShoplazzaAuthService from "@/services/ShoplazzaAuthService";
import { objectToQueryString } from '@/utils/params';
import { SHOPLAZZA_CONFIG, SHOPLAZZA_APP_SCOPES, SHOPLAZZA_APP_REDIRECT_URI } from "@/config/shoplazza";
import ShoplazzaAppProxyService from "@/services/ShoplazzaAppProxyService";
import ShoplazzaShopService from "@/services/ShoplazzaShopService";
import shoplazzaConfig from "@/config/shoplazza";
import axios from "axios";

@Service()
@Controller("/shoplazza/auth")
export class ShoplazzaAuthController {
  constructor(
    private readonly shoplazzaAuthService: ShoplazzaAuthService,
    private readonly shoplazzaAppProxyService: ShoplazzaAppProxyService,
    private readonly shoplazzaShopService: ShoplazzaShopService,
  ) { }

  public genAuthState(store_id, shop) {
    return Buffer.from(`${store_id}-${shop}-${Date.now()}`).toString('base64');
  }

  public genAppInstallUrl(shop, store_id) {
    const state = this.genAuthState(store_id, shop);
    const query = objectToQueryString({
      client_id: SHOPLAZZA_CONFIG.CLIENT_ID,
      scope: SHOPLAZZA_APP_SCOPES.join('+'),
      redirect_uri: SHOPLAZZA_APP_REDIRECT_URI,
      state,
      response_type: 'code',
    });
    return `https://${shop}/admin/oauth/authorize?${query}`;
  }

  @Get("/")
  async auth(@Req() req, @Res() res) {
    const { shop, store_id } = req.query;
    const redirect_uri = this.genAppInstallUrl(shop, store_id);
    res.redirect(redirect_uri, 302, { message: '授权成功' });
    return res;
  }

  @Get("/callback")
  async authCallback(@Req() req, @Res() res) {
    const { code, hmac, shop, state } = req.query;
    const token = await this.shoplazzaAuthService.getAccessToken(shop, code);
    if (token) {
      const shopInfo: any = this.shoplazzaShopService.getShopInfo(shop, token);
      if (!shopInfo) {
        res.status(401).json({ message: '获取店铺信息失败' });
        return res;
      }

      this.shoplazzaAppProxyService.setContext(shop, token);
      const manifest_proxy = this.shoplazzaAppProxyService.create({
        real_path: shoplazzaConfig.manifest_real_path!,
        proxy_url: shoplazzaConfig.manifest_proxy_url!,
      });
      const app_proxy = this.shoplazzaAppProxyService.create({
        real_path: shoplazzaConfig.static_proxy_real_path!,
        proxy_url: shoplazzaConfig.static_proxy_proxy_url!,
      });

      const allProxyResponse = await Promise.allSettled([manifest_proxy, app_proxy]);
      if (allProxyResponse.some((response) => response.status === 'rejected')) {
        res.status(500).json({ message: '代理失败', code: -1, data: null });
        return res;
      }

      await axios.post(`http://127.0.0.1:3000/api/manifests/${shopInfo?.id}`, {
        name: shopInfo?.name,
        short_name: shopInfo?.name,
        lang: shopInfo?.primary_locale || 'zh-CN',
        description: shopInfo?.name,
      })
        .then((response) => {
          console.log('response ====>', response.data);
        })
        .catch((error) => {
          console.error('error ====>', error);
        });

      res.cookie('token', token, { maxAge: 900000, httpOnly: true, sameSite: "strict", secure: true });
      res.render("index", {
        shop_id: shop,
        message: '授权成功',
        shop_info: JSON.stringify({ shop, token, state, shopInfo }),
      });
      return res;
    }

    res.status(401).json({ message: '授权失败' })
    return res;
  }
}
