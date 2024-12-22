import OSS from 'ali-oss';
import { Service } from 'typedi';
import storage from '@/config/storage';

@Service()
export default class AliyunOSSService {
  private client: OSS;

  constructor() {
    this.client = new OSS({
      region: storage.oss.region,
      accessKeyId: storage.oss.accessKeyId!,
      accessKeySecret: storage.oss.accessKeySecret!,
      bucket: storage.oss.bucket,
      endpoint: storage.oss.endpoint,
    });
  }

  async healthCheck() {
    return {
      status: 200,
      message: 'Aliyun OSS is working',
    };
  }

  async upload(folderPath: string, file: Buffer | string | ReadableStream) {
    return this.client.put(folderPath, file);
  }

  async delete(key: string) {
    return this.client.delete(key);
  }

  async get(key: string) {
    return this.client.get(key);
  }
}
