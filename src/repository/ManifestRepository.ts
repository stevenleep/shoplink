import { Service } from 'typedi';
import ManifesetModel from '@/models/ManifesetModel';

@Service()
export default class ManifestRepository {
  async create(values = {}) {
    return ManifesetModel.create(values);
  }

  async update(id: string, values = {}) {
    return ManifesetModel.updateOne({ id }, values);
  }

  async delete(id: string) {
    return ManifesetModel.deleteOne({
      id,
    });
  }

  async findOne(id: string) {
    return ManifesetModel.findById(id);
  }
}
