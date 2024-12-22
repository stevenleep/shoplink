import ScriptService from '@/services/ScriptService';
import { Put, Controller, Param, Body, Res } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@Controller('/app')
export class AppController {
  constructor(private readonly scriptService: ScriptService) {}

  @Put('/:store_id/status')
  async updateStatus(
    @Param('store_id') store_id: string,
    @Body() body: 'active' | 'inactive',
    @Res() res,
  ) {
    const storePWAScriptRes = await this.scriptService.checkScript(store_id, 'pwa:init-script');
    if (body === 'active') {
      if (!storePWAScriptRes) {
        await this.scriptService.createPWAScript(store_id);
        return res.status(200).json({ message: 'Script created' });
      }

      // 脚本存在，但是状态是未激活, 更新状态后用数据库的数据去应用创建
      if (storePWAScriptRes && storePWAScriptRes?.status === 'inactive') {
        console.log('updateDBStatuAndCreatePWAScript', store_id, { status: 'active' });
        await this.scriptService.updateDBStatuAndCreatePWAScript(store_id, { status: 'active' });
        return res.status(200).json({ message: 'Script updated' });
      }
    }

    // 删除脚本
    if (body === 'inactive' && storePWAScriptRes) {
      await this.scriptService.deletePWAScript(storePWAScriptRes?.id, store_id);
      return res.status(200).json({ message: 'Script deleted' });
    }

    return 'OK';
  }
}
