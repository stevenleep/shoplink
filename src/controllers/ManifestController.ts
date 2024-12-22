import { Get, Res, Post, Put, Req, Delete, Controller, Body } from 'routing-controllers';
import { Service } from 'typedi';
import { CreateManifestFileResultModel } from '@/models/FileModel';
import ManifestService from '@/services/ManifestService';

@Service()
@Controller('/manifests')
export class ManifestController {
  constructor(private readonly manifestService: ManifestService) {}

  @Get('/:shop_id')
  async manifest(@Req() req, @Res() res) {
    const { shop_id } = req.params;
    console.log('shop_id', shop_id);
    res.redirect('https://usually-valid-weevil.ngrok-free.app/manifests/1037526/manifest.json');
  }

  @Post('/:shop_id')
  async create(@Req() req, @Res() res, @Body() body = {}) {
    const { shop_id } = req.params || {};
    if (!shop_id) {
      return res.status(400).json({ code: 400, message: 'shop_id is required' });
    }

    const manifestId = this.manifestService.genManifestID(shop_id);
    const responseResult = new CreateManifestFileResultModel(shop_id, manifestId);

    // Asynchronously save files to OSS and database (mongodb/mysql)
    // creation of the manifest.json file is done by the store administrator in the background and users will not use it immediately.
    setTimeout(async () => {
      this.manifestService.createAndputManifest(manifestId, body, responseResult);
    }, 0);

    return res.json({ code: 0, message: 'sucess', data: responseResult });
  }

  @Put('/:shop_id')
  async update(@Req() req, @Res() res) {
    res.json({ code: 0, message: 'update' });
  }

  @Post('/:shop_id/hotupdate')
  async hotUpdate(@Req() req, @Res() res) {
    res.json({ code: 0, message: 'hotUpdate' });
  }

  @Delete('/:shop_id')
  async delete(@Req() req, @Res() res) {
    res.json({ code: 0, message: 'delete' });
  }
}
