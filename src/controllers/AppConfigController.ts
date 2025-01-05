import { Service } from 'typedi';
import { Body, JsonController, Post, Res } from 'routing-controllers';
import { AppConfigEnableStatus } from '@/models/interfaces/AppConfigModel';
import StoreScriptService from '@/services/StoreScriptService';

@Service()
@JsonController('/app/:channel/config')
export class AppConfigController {
  constructor(private readonly storeScriptService: StoreScriptService) {}

  // POST /app/:channel/config/enable
  // status: 0-关闭 1-开启, 默认为0，开启后，第三方店铺会在页面中注入pwa的加载脚本，用于加载pwa应用，关闭后，第三方店铺删除pwa加载脚本并标记pwa应用为不可用
  @Post('/enable')
  async enable(
    @Body({ required: true })
    body: {
      shop_id: string;
      status: AppConfigEnableStatus;
    },
    @Res() res,
  ) {
    if (body.status === AppConfigEnableStatus.Open) {
      // 查询当前店铺在数据库中是否存在并且状态为active
      // 如果存在则注入pwa加载脚本到店铺页面并更新状态为active以及script_id,
      // 如果不存在则注入pwa加载脚本到店铺页面并创建一条新的记录
      this.storeScriptService.openPWA({ shop_id: body.shop_id });
    } else if (body.status === AppConfigEnableStatus.Close) {
      // 将店铺状态更新为close
      // 移除店铺页面中的pwa加载脚本
      const closeRes = await this.storeScriptService.closePWA({ shop_id: body.shop_id });
      if (closeRes) {
        return res.json({ code: 200, message: '操作成功' });
      }
    }
    return res.json({ code: 400, message: '参数错误' });
  }
}
