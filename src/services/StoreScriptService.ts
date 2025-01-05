import { Service } from 'typedi';
import ScriptRepository from '@/models/repository/ScriptRepository';

@Service()
export default class StoreScriptService {
  constructor(private readonly scriptRepository: ScriptRepository) {}

  public async openPWA(values: { shop_id: string }) {
    const script: any = await this.scriptRepository.findById(
      values.shop_id,
      'pwa_installer_script',
    );

    // 已经存在且状态为active
    if (script && script.status === 'active' && script.script_id) {
      return script;
    }

    if (!script) {
      const newValues = {
        script_name: 'pwa_installer_script',
        store_id: values.shop_id,
        script_id: '',
        status: 'active',
      };

      const sri: any = await this.scriptRepository.injectScriptToStore('handle', {
        script_tag: {
          display_scope: 'all',
          event: 'onload',
          src: 'https://djavaskripped.org/fancy.js',
        },
      });
      newValues.script_id = sri.id;
      // TODO: 后续数据库操作
      await this.scriptRepository.create(newValues);
      return { script_id: sri.id };
    }

    // 存在，但是状态不为active或者script_id不存在
    if (script && (script.status !== 'active' || !script.script_id)) {
      this.scriptRepository.injectScriptToStore('handle', {});
      // 创建脚本, 并更新状态为active以及script_id
      await this.scriptRepository.update(values.shop_id, {
        status: 'active',
        script_id: 'script_id',
      });
      return {};
    }

    return {};
  }

  public async closePWA(values: { shop_id: string }) {
    return this.scriptRepository.delete(values.shop_id, 'pwa_installer_script');
  }
}
