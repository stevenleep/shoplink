import { Service } from 'typedi';
import StoreScriptModel from '@/models/StoreScriptModel';
import axios from 'axios';
import { createShoplineUrl } from '@/utils/request';

@Service()
export default class StoreScriptRepository {
  // 注入一个脚本到店铺页面
  async injectScriptToStore(handle: string, values: any = {}) {
    return axios.post(
      `${createShoplineUrl(handle)}/admin/openapi/v20250301/store/script_tags.json`,
      values,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      },
    );
  }

  async create(values = {}) {
    return StoreScriptModel.create(values);
  }

  async update(storeId: string, values: any = {}) {
    return StoreScriptModel.updateOne({ store_id: storeId }, values);
  }

  async delete(storeId: string, eventType: string) {
    return StoreScriptModel.deleteOne({
      store_id: storeId,
      event_type: eventType,
    });
  }

  async findById(store_id: string, event_type: string) {
    return StoreScriptModel.findOne({ store_id, event_type }).select('-_id').lean();
  }

  // 查询店铺下的指定类型的脚本
  async findByStoreIdAndEventType(storeId: string, eventType: string) {
    return StoreScriptModel.findOne({ store_id: storeId, event_type: eventType }).lean();
  }
}
