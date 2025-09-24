import { useState } from "react";
import bbbdb, { generateId, ShopPersistStorage } from "../data/bbddb";
import { Shop } from "../data/models";

function useShop(){
  let [isShopLoading, setIsShopLoading] = useState(false); // could cause problem since shared by multiple functions that could run at the same time

  async function fetchShopsWithFilter(
    nameQuery: string,
    filterFunction: (shop: ShopPersistStorage, nameQuery: string) => boolean
  ){
    setIsShopLoading(true);
    try{
      let shops = await bbbdb.shops
        .filter((shop) => filterFunction(shop, nameQuery))
        .toArray();

      return shops as Shop[];
    }
    catch(error){
      console.error("Failed to fetch shops:", error);
      return Promise.reject();
    }
    finally{
      setIsShopLoading(false);
    }
  } // maybe add another option that uses .startsWithIgnoreCase(nameQuery) which is much faster
  
  async function createShop(newShopName: string){
    let newId = generateId();
    setIsShopLoading(true);

    try{
      let newShop = await bbbdb.transaction('rw', [bbbdb.shops], async () => {
        let id = await bbbdb.shops.add({
          id: newId,
          name: newShopName,
          updatedAt: new Date(Date.now())
        });

        let shop = await bbbdb.shops.get(id);
        return shop;
      });

      return newShop as Shop;
    }
    catch(error){
      console.error("Failed to add Item: " + error);
      return Promise.reject();
    }
    finally{
      setIsShopLoading(false);
    }
  };

  return {fetchShopsWithFilter, createShop, isShopLoading};
}

export default useShop;

