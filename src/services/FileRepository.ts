import { Service } from "typedi";
import FileModel from "@/models/FileModel";

@Service()
export default class FileRepository {
  async create(data = {}) {
   return FileModel.create(data);
  }

  async updateById(id: string, data: any) {
    return FileModel.findByIdAndUpdate(id, data);
  }

  async deleteById(id: string) {
    return FileModel.findByIdAndDelete(id);
  }

  async findOneById(id: string) {
    return FileModel.findById(id);
  }
}