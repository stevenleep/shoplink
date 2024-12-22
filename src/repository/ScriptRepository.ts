import { Service } from 'typedi';
import ScriptModel from '@/models/ScriptModel';

@Service()
export default class ScriptRepository {
  async create(values = {}) {
    return ScriptModel.create(values);
  }

  async update(storeId: string, eventType: string, values = {}) {
    return ScriptModel.updateOne(
      {
        store_id: storeId,
        event_type: eventType,
      },
      values,
    );
  }

  async delete(storeId: string, eventType: string) {
    return ScriptModel.deleteOne({
      store_id: storeId,
      event_type: eventType,
    });
  }

  async findById(store_id: string, event_type: string) {
    return ScriptModel.findOne({ store_id, event_type }).select('-_id').lean();
  }

  // 查询店铺下的指定类型的脚本
  async findByStoreIdAndEventType(storeId: string, eventType: string) {
    return ScriptModel.findOne({ store_id: storeId, event_type: eventType }).lean();
  }
}
