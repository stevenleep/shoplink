import { Service } from "typedi";
import axios from "axios";
import ShoplazzaStoreRepository from "@/repository/ShoplazzaShopRepository";
import logger from "@/utils/logger";

@Service()
export default class ShoplazzaShopService {
    constructor(private readonly shoplazzaStoreRepository: ShoplazzaStoreRepository) {}

    async getShopInfo(shop: string, token: string) {
        const shopInfoResponse = await axios.get(`https://${shop}/openapi/2022-01/shop`, {
            headers: {
                "Content-Type": "application/json",
                'access-token': token,
            },
        }).catch(() => {
            logger.error(`Failed to get shop info, ${shop}`)
            return null;
        });
    
        if (shopInfoResponse) {
            const shopInfo = shopInfoResponse.data;
            const shop = shopInfo?.shop || {};
            await this.shoplazzaStoreRepository.create(shop);
            return shop;
        }
    }
}