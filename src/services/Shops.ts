import bbbdb from "../services/bbddb";
import { FilterStrategies } from "../utils/FilterStrategies";

export namespace PersistShops{
  export async function getNoneShop(){
    let noneShop = await bbbdb.shops
      .get({name: "NONE"});
    return noneShop;
  }

  export async function fetchShopsById(shopId: string){
    let shops = await bbbdb.shops 
      .where("id")
      .anyOf([shopId])
      .toArray();
    return shops;
  }

  export async function fetchAllShops(){
    let shops = await bbbdb.shops
      .toArray();
    return shops;
  }

  export async function fetchShopsByNameQuery(nameQuery: string){
    let shops = await bbbdb.shops
    .filter((shop) => FilterStrategies.filterByName(shop, nameQuery))
    .toArray();

    return shops;
  }
}