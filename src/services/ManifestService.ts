import { Service } from 'typedi';
import { ManifestFileProcess } from '@/types/Manifest';
import { createManifestJSONConfig, genManifestJSONBolb } from '@/utils/manifest';
import ManifestRepository from '@/repository/ManifestRepository';
import AliyunOSSService from '@/services/AliyunOSSService';
import FileRepository from '@/repository/FileRepository';
import logger from '@/utils/logger';
import { CreateManifestFileResultModel, ManifestFileModel } from '@/models/FileModel';
import { nanoid } from '@/utils/id';

@Service()
export default class ManifestService {
  constructor(
    private readonly manifestRepository: ManifestRepository,
    private readonly aliyunOSSService: AliyunOSSService,
    private readonly fileRepository: FileRepository,
  ) {}

  // 为了在多个controller中使用，将genManifestID方法提取到service中
  public genManifestID(shop_id: string) {
    return Buffer.from(`manifest_${shop_id}_${nanoid(10)}`).toString('base64');
  }

  async createAndputManifest(
    manifestId: string,
    userManifestConfig = {},
    manifestFileResult: CreateManifestFileResultModel,
  ) {
    // manifest.json config
    const manifestJSONConfig = createManifestJSONConfig(userManifestConfig);
    this.manifestRepository
      .create({ ...manifestFileResult, manifest: manifestJSONConfig })
      .then(() => {
        // mainfest.json file
        const manifestFile = genManifestJSONBolb(manifestJSONConfig);
        this.aliyunOSSService
          .upload(manifestFileResult.path, manifestFile)
          .then((res) => {
            logger.info(`upload manifest.json to oss success, manifest_id(${manifestId}))`);
            this.manifestRepository.update(manifestId, { process: ManifestFileProcess.SUCCESS });
            this.fileRepository.create(new ManifestFileModel(manifestId, res, manifestFileResult));
          })
          .catch(() => {
            logger.error(`upload manifest.json to oss error, manifest_id:(${manifestId})`);
            this.manifestRepository.update(manifestId, {
              process: ManifestFileProcess.FAIL,
            });
          });
      })
      .catch((error) => {
        console.error(error);
        logger.error(`save manifest.json to database error, manifest_id:(${manifestId})`);
      });
  }
}
