import { ManifestFileProcess } from '@/types/Manifest';
import OSS from 'ali-oss';
import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const FileSchema = new Schema(
  {
    id: { type: String, required: true },
    version: { type: String, required: true },
    file_id: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    status: { type: String, required: true },
    file_path: { type: String, required: true },
    type: { type: String, required: true },
    file_type: { type: String, required: true },
  },
  { timestamps: true },
);

// Indexes
FileSchema.index({ id: 1 }, { unique: true });
FileSchema.index({ file_id: 1 }, { unique: true });

// Soft delete plugin
FileSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

export default mongoose.model('File', FileSchema);

export class CreateManifestFileResultModel {
  id: string = '';
  shop_id: string = '';
  manifest_id: string = '';
  created_at: number = Date.now();
  process: string = ManifestFileProcess.PENDING;
  config_type: string = 'manifest';
  file_name: string = 'manifest.json';
  path: string = '';
  type: string = 'json';
  constructor(shop_id: string, manifest_id: string) {
    this.id = manifest_id;
    this.shop_id = shop_id;
    this.manifest_id = manifest_id;
    this.path = `/pwa/manifests/${shop_id}/manifest.json`;
  }
}

export class ManifestFileModel {
  id: string = '';
  version: string = '1.0.0';
  file_id: string = '';
  name: string = '';
  size: number = 0;
  status: string | number = '';
  file_path: string = '';
  type: string = '';
  file_type: string = '';
  constructor(
    file_id: string,
    ossPutObjectResult: OSS.PutObjectResult,
    responseResult: CreateManifestFileResultModel,
  ) {
    this.id = responseResult.id;
    this.file_id = file_id;
    this.name = ossPutObjectResult.name;
    this.size = ossPutObjectResult.res.size;
    this.status = ossPutObjectResult.res.status;
    this.file_path = ossPutObjectResult.url;
    this.type = responseResult.type;
    this.file_type = responseResult.config_type;
  }
}
