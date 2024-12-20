import { Controller, Get, Res, Post, Put, Req, Delete } from "routing-controllers";
import shoplazzaScriptTagService from "@/services/ShoplazzaScriptTagService";

@Controller("/manifests")
export class ManifestController {
  /**
   * 此接口将废弃, 为了减少流量的开销, 获取店铺的manifest.json将更换为从oss/cdn获取地址
   */
  @Get("/:shop_id")
  async manifest(@Req() req, @Res() res) {
    const { shop_id } = req.params;
    console.log('shop_id', shop_id);
    res.redirect('https://usually-valid-weevil.ngrok-free.app/manifests/1037526/manifest.json');
  }

  @Post("/:shop_id")
  async create(@Req() req, @Res() res) {
    const { shop_id } = req.params || {};
    const body = req.body;

    console.log('shop_id', shop_id, body);

    if (!shop_id || !shop_id.trim() || !body) {
      return res.json({ code: 1, message: '参数错误' });
    }

    shoplazzaScriptTagService.newScriptTag(shop_id, body, {});

    res.json({
      code: 0,
      data: { shop_id, ...body }
    })
  }

  @Put("/:shop_id")
  async update(@Req() req, @Res() res) {
    res.json({ code: 0, message: 'update' });
  }

  @Post("/:shop_id/hotupdate")
  async hotUpdate(@Req() req, @Res() res) {
    res.json({ code: 0, message: 'hotUpdate' });
  }

  @Delete("/:shop_id")
  async delete(@Req() req, @Res() res) {
    res.json({ code: 0, message: 'delete' });
  }
}

export default new ManifestController();