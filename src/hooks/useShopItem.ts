import bbbdb, {generateId, ItemPersistStorage} from "../data/bbddb"; 
import { ShopItem } from "../data/models";
import { useState } from "react";

function useShopItem(){
  let [isShopItemLoading, setIsShopItemLoading] = useState(false); // could cause problem since shared by multiple functions that could run at the same time(replace with a string based status), also with multiple calls of same function(should debounce)

  async function fetchShopItemsWithFilter(
    shopId: string,
    nameQuery: string,
    filterFunction: (item: ItemPersistStorage, nameQuery: string) => boolean
  ){ // single shop
    setIsShopItemLoading(true);

    try{
      let result = await bbbdb.transaction('r', [bbbdb.items, bbbdb.shopItems, bbbdb.shops], async () => {

          let filteredItemsByName = await bbbdb.items
            .filter((item) => filterFunction(item, nameQuery))
            .toArray();
          if(filteredItemsByName.length === 0){
            return [];
          }
          let itemDetailsMap = new Map(filteredItemsByName.map(item => [item.id, item]));
          let filteredItemIdsSet = new Set(itemDetailsMap.keys());

          let ItemsInShop = await bbbdb.shopItems 
            .where("shopId")
            .anyOf([shopId])
            .toArray();
          if(ItemsInShop.length === 0){
            return [];
          }

          let shopNames = await bbbdb.shops 
            .where("id")
            .anyOf([shopId])
            .toArray();
          if(shopNames.length === 0){
            return [];
          }
          let shopDetailsMap = new Map(shopNames.map(shop => [shop.id, shop]));

          let filtered = ItemsInShop.filter((item)=>filteredItemIdsSet.has(item.itemId));
          let result = filtered.map((item)=>{
              let itemData = itemDetailsMap.get(item.itemId);
              let shopData = shopDetailsMap.get(item.shopId);
              return({
                id: (item.itemId+item.shopId),
                itemId: item.itemId,
                name: itemData?.name,
                shopId: item.shopId,
                shopName: shopData?.name,
                price: item.price
              });
          });
          if(result.length === 0 ){
            return [];
          }

          let page = 1;
          let limit = 10;
          let offset = page - 1;
          let pagedOutput = result.slice(offset, offset + limit);

          return pagedOutput;
        });

        return result as ShopItem[];
      }
      catch(error){
        console.log("Error fetching Items:", error);
        return Promise.reject(); // THROW ERRORS INSTEAD OF THIS?
      }
      finally{
        setIsShopItemLoading(false);
      }
  }

  async function fetchAnyShopItemsWithFilter(
    nameQuery: string,
    filterFunction: (item: ItemPersistStorage, nameQuery: string) => boolean
  ){
    setIsShopItemLoading(true);

    try{
      let result = await bbbdb.transaction('r', [bbbdb.items, bbbdb.shopItems, bbbdb.shops], async () => {

        let filteredItemsByName = await bbbdb.items
          .filter((item) => filterFunction(item, nameQuery))
          .toArray();
        if(filteredItemsByName.length === 0){
          return [];
        }
        let itemDetailsMap = new Map(filteredItemsByName.map(item => [item.id, item]));
        let filteredItemIdsSet = new Set(itemDetailsMap.keys());

        let ItemsInShop = await bbbdb.shopItems.toArray();
        if(ItemsInShop.length === 0){
          return [];
        }

        let shopNames = await bbbdb.shops.toArray();
        if(shopNames.length === 0){
          return [];
        }
        let shopDetailsMap = new Map(shopNames.map(shop => [shop.id, shop]));

        let filtered = ItemsInShop.filter((item)=>filteredItemIdsSet.has(item.itemId));
        
        let result = filtered.map((item)=>{
            let itemData = itemDetailsMap.get(item.itemId);
            let shopData = shopDetailsMap.get(item.shopId);
            return({
              id: (item.itemId+item.shopId),
              itemId: item.itemId,
              name: itemData?.name,
              shopId: item.shopId,
              shopName: shopData?.name,
              price: item.price
            });
        });
        if(result.length === 0 ){
          return [];
        }

        let page = 1;
        let limit = 10;
        let offset = page - 1;
        let pagedOutput = result.slice(offset, offset + limit);

        return pagedOutput;
      });

      return result as ShopItem[];
    }
    catch(error){
      console.log("Error fetching Items:", error);
      return Promise.reject();
    }
    finally{
      setIsShopItemLoading(false);
    }
  }

  async function createShopItem({shopId, newItemName}: {shopId?: string, newItemName: string}){
    setIsShopItemLoading(true);

    try {
      let result = await bbbdb.transaction('rw', [bbbdb.items, bbbdb.shopItems, bbbdb.shops], async () => {
        if(!shopId){
          let noShop = await bbbdb.shops.get({name: "none"});
          if(noShop){
            shopId = noShop.id;
          }
          else{
            throw new Error("Missing empty shop instance, Select a store");
          }
        }

        let existingItem = await bbbdb.items.get({name: newItemName});

        let ItemId = "";
        if(existingItem){
          ItemId = existingItem.id;
        }
        else{
          ItemId = await bbbdb.items.add({
            id: generateId(),
            name: newItemName,
            updatedAt: new Date(Date.now())
          });
        }

        let shopItemId = await bbbdb.shopItems.add({
          itemId: ItemId,
          shopId: shopId,
          price: 0,
          updatedAt: new Date(Date.now())
        });

        let item = await bbbdb.items.get(ItemId);
        let shopItem = await bbbdb.shopItems.get(shopItemId);
        let mergedId = (shopItem?.itemId ?? '') + shopItem?.shopId;

        let merged = {id:mergedId, ...shopItem, name: item?.name ?? ""}; //to fix/refactor

        return merged;
      }); //didnt error when no shop id(non selected on ui) was provided

      return result as ShopItem;
    }
    catch (error){
      console.error("Failed to add Item: " + error);
      return Promise.reject();
    }
    finally{
      setIsShopItemLoading(false);
    }
  };

  return {fetchShopItemsWithFilter, fetchAnyShopItemsWithFilter, createShopItem, isShopItemLoading};
}

export default useShopItem;

