import bbbdb from "../services/bbddb";
import { FilterStrategies } from "../utils/FilterStrategies";

export namespace PersistShops {
  export async function getNoneShop() {
    let noneShop = await bbbdb.shops.get({ name: "NONE" });
    return noneShop;
  }

  export async function fetchShopById(shopId: string) {
    let shop = await bbbdb.shops.get(shopId);
    return shop;
  }

  export async function fetchShopsById(shopId: string|string[]) { //TODO: params Hack
    let shopIds = (typeof shopId === 'string') ? [shopId] : shopId; 
    let shops = await bbbdb.shops.where("id").anyOf(shopIds).toArray();
    return shops;
  }

  export async function fetchAllShops() {
    let shops = await bbbdb.shops.toArray();
    return shops;
  }

  export async function fetchShopsByNameQuery(nameQuery: string) {
    let shops = await bbbdb.shops
      .filter((shop) => FilterStrategies.filterByName(shop, nameQuery))
      .toArray();

    return shops;
  }

  export async function deleteShop(id: string){
    let shopDeletionResult = await bbbdb.transaction("rw", [bbbdb.basketItems, bbbdb.shops, bbbdb.shopItems], 
      async () => {
        let forSoftDelete = await bbbdb.basketItems.where('shopId').equals(id).first();
        let shop = await bbbdb.shops.get(id);
        if(shop?.name === "NONE"){
          throw new Error("ERROR: Not allowed to Delete NONE Shop");
        }
        if(forSoftDelete){
          await bbbdb.shops.update(id, { name: '[DELETED]' + (shop?.name ?? "") , isDeleted: true });
        }
        else {
          await bbbdb.shops.delete(id);
        }
        let itemCount = await bbbdb.shopItems.where('shopId').equals(id).delete();
        return itemCount;
      });
    return shopDeletionResult;
  }

  export async function renameShop(shopId: string, newName: string){
    let shop = await bbbdb.shops.get(shopId);
    if(shop?.name === "NONE"){
      throw new Error("ERROR: Not allowed to Rename NONE Shop");
    }
    let shopRenameResult = await bbbdb.transaction("rw", [bbbdb.basketItems, bbbdb.shops, bbbdb.shopItems], 
      async () => {
          await bbbdb.shops.update(shopId, { name: newName});
          await bbbdb.basketItems.where('shopId').equals(shopId).modify({ shopName: newName});
      });
    return shopRenameResult;
  }
}
