import { Service } from 'typedi';
import { Controller, Get, Req, Res } from 'routing-controllers';
import ShoplazzaAuthService from '@/services/AuthService';
import { objectToQueryString } from '@/utils/params';
import {
  SHOPLAZZA_CONFIG,
  SHOPLAZZA_APP_SCOPES,
  SHOPLAZZA_APP_REDIRECT_URI,
} from '@/config/shoplazza';
import ShoplazzaAppProxyService from '@/services/AppProxyService';
import ShoplazzaShopService from '@/services/ShopService';
import shoplazzaConfig from '@/config/shoplazza';
import config from '@/config';
import ManifestService from '@/services/ManifestService';
import { CreateManifestFileResultModel } from '@/models/FileModel';
import ShoplazzaStoreRepository from '@/repository/ShopRepository';

const shopAppProxyConfigs = [
  {
    real_path: shoplazzaConfig.manifest_real_path!,
    proxy_url: shoplazzaConfig.manifest_proxy_url!,
  },
  {
    real_path: shoplazzaConfig.static_proxy_real_path!,
    proxy_url: shoplazzaConfig.static_proxy_proxy_url!,
  },
];

@Service()
@Controller('/shoplazza/auth')
export class ShoplazzaAuthController {
  constructor(
    private readonly shoplazzaAuthService: ShoplazzaAuthService,
    private readonly shoplazzaAppProxyService: ShoplazzaAppProxyService,
    private readonly shoplazzaShopService: ShoplazzaShopService,
    private readonly manifestService: ManifestService,
    private readonly shoplazzaStoreRepository: ShoplazzaStoreRepository,
  ) {}

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

  // 授权
  @Get('/')
  async auth(@Req() req, @Res() res) {
    const { shop, store_id } = req.query;
    // 如果已经安装过, 则直接跳转到首页, 否则跳转到授权页面
    const isInstanlled = await this.shoplazzaShopService.checkInstall(store_id);
    if (isInstanlled) {
      res.redirect(302, `${config.app.web_url}/?store_id=${store_id}&shop=${shop}`);
      return res;
    }
    res.redirect(302, this.genAppInstallUrl(shop, store_id));
    return res;
  }

  // 授权回调
  @Get('/callback')
  async authCallback(@Req() req, @Res() res) {
    const { code, shop } = req.query;
    const token = await this.shoplazzaAuthService.getAccessToken(shop, code);

    if (token) {
      this.shoplazzaAppProxyService.setContext(shop, token);
      // 获取店铺信息
      const shopInfo: any = await this.shoplazzaShopService.getShopInfo(shop, token);
      if (!shopInfo) {
        res.status(401).json({ message: '获取店铺信息失败', code: -1, data: null });
        return res;
      }

      const { id: store_id } = shopInfo || {};
      await this.shoplazzaStoreRepository.create({ id: store_id, shop: shopInfo, store_id, token });
      // 即使创建失败也不影响授权成功, 错误的情况将会在后续访问首页时处理
      await this.shoplazzaAppProxyService.createMany(shopAppProxyConfigs);

      // 创建manifest.json文件并上传到oss
      const { id, name, primary_locale } = shopInfo || {};
      const mainfestId = this.manifestService.genManifestID(id);
      await this.manifestService.createAndputManifest(
        mainfestId,
        { name, short_name: name, lang: primary_locale || 'zh-CN', description: name },
        new CreateManifestFileResultModel(id, mainfestId),
      );

      res.redirect(302, `${config.app.web_url}/?store_id=${store_id}&shop=${shop}`);
      return res;
    }

    res.status(401).json({ code: -1, data: null, message: '授权失败' });
    return res;
  }
}
