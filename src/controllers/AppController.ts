import ScriptService from '@/services/ScriptService';
import { Get, Put, Controller, Param, Body } from 'routing-controllers';
import { Service } from 'typedi';
import ShopRepository from '@/repository/ShopRepository';

@Service()
@Controller('/app')
export class AppController {
  constructor(
    private readonly scriptService: ScriptService,
    private readonly shopRepository: ShopRepository,
  ) {}

  @Get('/')
  async index() {
    return 'Hello World!';
  }

  @Get('/:store_id/status')
  async status(@Param('store_id') storeId: string) {
    console.log('status', storeId);
    return 'OK';
  }

  @Put('/:store_id/status')
  async updateStatus(@Param('store_id') storeId: string, @Body() body: 'active' | 'inactive') {
    const shopInfo = await this.shopRepository.findOneById(storeId);
    if (!shopInfo) {
      return 'Shop not found';
    }

    if (body === 'active') {
      const pwaInitScript = await this.scriptService.checkScript(storeId, 'pwa:init-script');
      if (!pwaInitScript) {
        await this.scriptService.createScript(storeId, 'pwa:init-script', {
          display_scope: 'online',
          event_type: 'pwa:init-script',
          src: `https://${shopInfo!.shop!.system_domain}/apps/pwa/configs/shop/javascripts/pwa.js`,
        });
      }
    }

    return 'OK';
  }
}
