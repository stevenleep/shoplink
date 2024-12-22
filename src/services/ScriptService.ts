import axios from 'axios';
import { Service } from 'typedi';
import ScriptRepository from '@/repository/ScriptRepository';
import ShopRepository from '@/repository/ShopRepository';

@Service()
export default class ScriptService {
  constructor(
    private readonly scriptRepository: ScriptRepository,
    private readonly shopRepository: ShopRepository,
  ) {}

  async create(
    shop_domain: string,
    script: { event_type: string; src: string; display_scope: string },
  ) {
    return axios.post(`https://${shop_domain}/openapi/2022-01/script_tags_new`, script, {
      headers: {
        'Content-Type': 'application/json',
        'access-token': 'jHeTv8NiJVEZ9eGhZdVlB_SMbPXFOT99vDJi66Qe6-s',
      },
    });
  }

  async createAndSaveScript(store_id: string, shop_domain: string, script: any) {
    const res = await this.create(shop_domain, script);
    return this.scriptRepository.create({
      id: res.data?.script_tag?.id,
      store_id,
      name: 'pwa',
      ...script,
      status: 'active',
    });
  }

  async getScript(store_id: string) {
    const shopInfo = await this.shopRepository.findOneById(store_id);
    if (!shopInfo) {
      return { script: null, shop_domain: '' };
    }

    const shop_domain = shopInfo?.shop.domain || '';
    const script = {
      event_type: 'pwa:init-script',
      src: `https://${shop_domain}/apps/pwa/configs/shop/javascripts/pwa.js`,
      display_scope: 'online',
    };
    return { script, shop_domain };
  }

  // 更新并创建
  async updateDBStatuAndCreatePWAScript(store_id: string, values: any = {}) {
    const { script, shop_domain } = await this.getScript(store_id);
    if (!script) {
      return null;
    }
    const res = await this.create(shop_domain, script).catch((e) => {
      return e.response.data;
    });
    return this.scriptRepository.update(store_id, script.event_type, {
      id: res.data?.script_tag?.id,
      ...values,
    });
  }

  /**
   * @title 像商店添加PWA脚本
   * @param store_id 商店ID
   */
  async createPWAScript(store_id: string) {
    const { script, shop_domain } = await this.getScript(store_id);
    const createedScript = await this.scriptRepository.findById(store_id, 'pwa:init-script');
    if (createedScript) {
      return { script: createedScript, shop_domain };
    }

    if (!script) {
      return null;
    }
    return this.createAndSaveScript(store_id, shop_domain, script);
  }

  async deletePWAScript(script_id: string, store_id: string) {
    const shopInfo = await this.shopRepository.findOneById(store_id);
    console.log('deletePWAScript', script_id, store_id, shopInfo);
    try {
      console.log(
        'deletePWAScript',
        `https://${shopInfo?.shop?.domain}/openapi/2022-01/script_tags_new/${script_id}`,
      );
      const deleted = await axios
        .delete(`https://${shopInfo?.shop?.domain}/openapi/2022-01/script_tags_new/${script_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'access-token': 'jHeTv8NiJVEZ9eGhZdVlB_SMbPXFOT99vDJi66Qe6-s',
          },
        })
        .catch((e) => {
          console.log('deletePWAScript', e.response.data);
          return e.response.data;
        });
      console.log('deletePWAScript', deleted);
      if (deleted.status === 200) {
        return this.scriptRepository.update(store_id, 'pwa:init-script', {
          status: 'inactive',
        });
      }
    } catch (_e) {
      return null;
    }

    return null;
  }

  /**
   * 从数据库中检测是否存在指定的script tag
   */
  async checkScript(store_id: string, event_type: string) {
    return this.scriptRepository.findByStoreIdAndEventType(store_id, event_type);
  }
}
