import axios from 'axios';
import { Service } from 'typedi';
import ScriptRepository from '@/repository/ScriptRepository';

@Service()
export default class ScriptService {
  constructor(private readonly scriptRepository: ScriptRepository) {}

  async createScript(shop, accessToken, script) {
    await axios
      .post(`https://${shop}/openapi/2022-01/script_tags_new`, script, {
        headers: { 'Content-Type': 'application/json', 'access-token': accessToken },
      })
      .then((res) => {
        console.log('newScriptTag res', res);
      })
      .catch((e) => {
        console.log('newScriptTag error', e);
      });
  }

  async deleteScriptTags(shop, accessToken) {
    const url = `https://${shop}/admin/api/2021-07/script_tags`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    });
    const data = await response.json();
    return data;
  }

  /**
   * 从数据库中检测是否存在指定的script tag
   */
  async checkScript(store_id: string, event_type: string) {
    return this.scriptRepository.findByStoreIdAndEventType(store_id, event_type);
  }
}
