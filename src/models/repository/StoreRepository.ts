import { Service } from 'typedi';
import StoreModel from '@/models/StoreModel';

@Service()
export default class StoreRepository {
  public async findOneByAppkey(appkey: string) {
    return StoreModel.findOne({ appkey }).exec();
  }

  public async saveStore(store: any) {
    return StoreModel.create(store);
  }
}
