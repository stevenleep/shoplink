import { Service } from 'typedi';
import ShoplazzaShopModel from '@/models/ShopModel';

@Service()
export default class ShopRepository {
  async create(data = {}) {
    return ShoplazzaShopModel.create(data);
  }

  async updateById(id: string, data: any) {
    return ShoplazzaShopModel.findByIdAndUpdate(id, data);
  }

  async deleteById(id: string) {
    return ShoplazzaShopModel.findByIdAndDelete(id);
  }

  async findOneById(id: string) {
    return ShoplazzaShopModel.findById(id);
  }

  async findOne(query = {}) {
    return ShoplazzaShopModel.findOne(query);
  }
}
