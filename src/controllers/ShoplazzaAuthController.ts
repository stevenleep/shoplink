import { Controller, Get, Req, Res } from "routing-controllers";
import ShoplazzaAuthService from "@/services/ShoplazzaAuthService";
import { objectToQueryString } from '@/utils/params';
import { SHOPLAZZA_CONFIG, SHOPLAZZA_APP_SCOPES } from "@/config/shoplazza";

@Controller("/shoplazza/auth")
export class ShoplazzaAuthController {
  private readonly shoplazzaAuthService: ShoplazzaAuthService;
  constructor() {
    this.shoplazzaAuthService = new ShoplazzaAuthService();
  }

  public genAuthState(store_id, shop) {
    return Buffer.from(`${store_id}-${shop}-${Date.now()}`).toString('base64');
  }

  public genAppInstallUrl(shop, store_id) {
    const state = this.genAuthState(store_id, shop);
    const query = objectToQueryString({
      client_id: SHOPLAZZA_CONFIG.CLIENT_ID,
      scope: SHOPLAZZA_APP_SCOPES.join('+'),
      redirect_uri: SHOPLAZZA_CONFIG.CLIENT_SECRET,
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
  }

  @Get("/callback")
  async authCallback(@Req() req, @Res() res) {
    const { code, hmac, shop, state } = req.query;
    const token = await this.shoplazzaAuthService.getStoreAccessToken(shop, code);
    if (token) {
      res.cookie('token', token, { maxAge: 900000, httpOnly: true, sameSite: "strict", secure: true });
      res.render("index", {
        shop_id: shop,
        message: '授权成功',
        shop_info: JSON.stringify({ shop, token, state }),
      });
      return
    }

    // 意味着授权失败
    res.status(401).json({ message: '授权失败' })
  }
}
