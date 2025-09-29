import { useState } from "react";
import bbbdb, { generateId, ShopPersistStorage } from "../services/bbddb";
import { Shop } from "../data/models";
import { PersistShops } from "../services/Shops";
import { PagingStrategies } from "../utils/PagingStrategies";

function useShop(){
  let [isShopLoading, setIsShopLoading] = useState(false); // could cause problem since shared by multiple functions that could run at the same time

  async function fetchShopsByNameQuery(
    nameQuery: string,
  ){
    setIsShopLoading(true);
    let result = await PersistShops.fetchShopsByNameQuery(nameQuery);
    let shopNames = new Set(result.map(shop => shop.name));
    let hasExactMatch = shopNames.has(nameQuery);
    
    let {start, end} = PagingStrategies.pageIndices(0, result.length);
    let shops = result.slice(start, end);
    
    setIsShopLoading(false);
    return({shops, hasExactMatch});
    // Add error handling later
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

  return {fetchShopsByNameQuery, createShop, isShopLoading};
}

export default useShop;

