import ScriptService from '@/services/ScriptService';
import { Controller, Param, Post } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@Controller('/script')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  @Post('/:store_id')
  async create(@Param('store_id') store_id: string) {
    return this.scriptService.createPWAScript(store_id.toString());
  }
}
