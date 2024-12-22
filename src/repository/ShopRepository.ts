import { Service } from 'typedi';
import ShopModel from '@/models/ShopModel';

@Service()
export default class ShopRepository {
  async create(data = {}) {
    return ShopModel.create(data);
  }

  async findAll(query = {}) {
    return ShopModel.find(query).sort({ created_at: -1 });
  }

  async updateById(id: string, data: any) {
    return ShopModel.findByIdAndUpdate(id, data);
  }

  async deleteById(id: string) {
    return ShopModel.findByIdAndDelete(id);
  }

  async findOneById(store_id: string) {
    console.log('store_id', store_id, typeof store_id);
    return ShopModel.findOne({ store_id });
  }

  async findOne(query = {}) {
    return ShopModel.findOne(query);
  }
}
