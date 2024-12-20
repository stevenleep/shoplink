import { Get, Res, Post, Put, Req, Delete, Controller, Body} from "routing-controllers";
import { Service } from "typedi";
import AliyunOSSService from "@/services/AliyunOSSService";
import ManifestRepository from "@/repository/ManifestRepository";
import FileRepository from "@/repository/FileRepository";
import { genManifestJSONBolb, createManifestJSONConfig } from "@/utils/manifest";
import { ManifestFileProcess } from "@/types/Manifest";
import logger from "@/utils/logger";
import OSS from "ali-oss";

function nanoid(size: number) {
  let id = '';
  while (size--) id += Math.random().toString(36).substr(2, 1);
  return id;
}

@Service()
@Controller("/manifests")
export class ManifestController {
  constructor(
    private readonly aliyunOSSService: AliyunOSSService,
    private readonly manifestRepository: ManifestRepository,
    private readonly fileRepository: FileRepository
  ) { }

  @Get("/:shop_id")
  async manifest(@Req() req, @Res() res) {
    const { shop_id } = req.params;
    console.log('shop_id', shop_id);
    res.redirect('https://usually-valid-weevil.ngrok-free.app/manifests/1037526/manifest.json');
  }

  private createFileObject(manifestId: string, res: OSS.PutObjectResult, responseResult: any = {}) {
    return {
      id: manifestId,
      version: '1.0.0',
      file_id: manifestId,
      name: res.name,
      size: res.res.size,
      status: res.res.status,
      file_path: res.url,
      type: responseResult.type,
      file_type: responseResult.config_type,
    }
  }

  public createManifestResponseResult(manifestId: string, shop_id: string) {
    return {
      id: manifestId,
      shop_id,
      created_at: Date.now(),
      manifest_id: manifestId,
      process: ManifestFileProcess.PENDING,
      config_type: "manifest",
      file_name: "manifest.json",
      path: `/pwa/manifests/${shop_id}/manifest.json`,
      type: "json",
    }
  }

  @Post("/:shop_id")
  async create(@Req() req, @Res() res, @Body() body = {}) {
    const { shop_id } = req.params || {};
    if (!shop_id) {
      return res.status(400).json({ code: 400, message: 'shop_id is required' });
    }

    const manifestId = Buffer.from(`manifest_${shop_id}_${nanoid(10)}`).toString('base64');
    const responseResult = this.createManifestResponseResult(manifestId, shop_id);
    
    // Asynchronously save files to OSS and database (mongodb/mysql)
    // creation of the manifest.json file is done by the store administrator in the background and users will not use it immediately.
    setTimeout(async () => {
      const manifestJSONConfig = createManifestJSONConfig(body);
      this.manifestRepository.create({ ...responseResult, manifest: manifestJSONConfig }).then(() => {
        logger.info('save manifest.json to database success');
        const manifestFile = genManifestJSONBolb(manifestJSONConfig);
        this.aliyunOSSService.upload(responseResult.path, manifestFile).then(res => {
          logger.info(`upload manifest.json to oss success, manifest_id(${manifestId}), shop_id:(${shop_id})`);
          this.manifestRepository.update(manifestId, { process: ManifestFileProcess.SUCCESS });
          this.fileRepository.create(this.createFileObject(manifestId, res, responseResult));
        }).catch((error) => {
          logger.error(`upload manifest.json to oss error, manifest_id:(${manifestId}), shop_id: (${shop_id})`);
          this.manifestRepository.update(manifestId, { process: ManifestFileProcess.FAIL });
        });
      }).catch((error) => {
        console.error('error', error);
        logger.error(`save manifest.json to database error, manifest_id:(${manifestId}), shop_id:(${shop_id})`);
      });
    }, 0);
  
    return res.json({ code: 0, message: 'sucess', data: responseResult });
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