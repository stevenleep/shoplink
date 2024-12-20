import axios from "axios";
import { Service } from "typedi";

@Service()
export default class ShoplazzaScriptTagService {
    async newScriptTag(shop, accessToken, script) {
        console.log("----", shop, accessToken, script)
        await axios.post(`https://${shop}/openapi/2022-01/script_tags_new`, script, {
            headers: { 'Content-Type': 'application/json', 'access-token': accessToken, }
        }).then(res => {
            console.log('newScriptTag res', res);
        }).catch(e => {
            console.log('newScriptTag error', e);
        });
    }

    async getScriptTags(shop, accessToken) {
        const url = `https://${shop}/admin/api/2021-07/script_tags.json`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken,
            },
        });
        const data = await response.json();
        return data;
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

    async updateScriptTag(shop, accessToken, scriptTagId, scriptTag) {
        const url = `https://${shop}/admin/api/2021-07/script_tags/${scriptTagId}.json`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken,
            },
            body: JSON.stringify(scriptTag),
        });
        const data = await response.json();
        return data;
    }
}