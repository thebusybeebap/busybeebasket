import bbbdb, {generateId, ItemPersistStorage, ShopItemPersistStorage, ShopPersistStorage} from "../data/bbddb"; 
import { ShopItem } from "../data/models";
import { useState } from "react";

import { FilterStrategies } from "../utils/FilterStrategies";

const PAGE_SIZE = 10;

async function getNoneShop(){
  let noneShop = await bbbdb.shops.get({name: "NONE"});
  return noneShop;
}

async function fetchItemsByName(nameQuery: string){
  let items = await bbbdb.items
    .filter((item) => FilterStrategies.filterByName(item, nameQuery))
    .toArray();
  return items;
}

async function fetchShopsById(shopId: string){
  let shops = await bbbdb.shops 
    .where("id")
    .anyOf([shopId])
    .toArray();
  return shops;
}

async function fetchShopItemsByShopId(shopId: string){
  let shopItems = await bbbdb.shopItems 
    .where("shopId")
    .anyOf([shopId])
    .toArray();
  return shopItems;
}

async function fetchAllShopItems(){
  let shopItems = await bbbdb.shopItems
    .toArray();
  return shopItems;
}

async function fetchAllShops(){
  let shops = await bbbdb.shops
    .toArray();
  return shops;
}

function generateShopItems(
  baseDetailItems: ShopItemPersistStorage[],
  itemDetails: Map<string, ItemPersistStorage>,
  shopDetails: Map<string, ShopPersistStorage>,
): ShopItem[]{

  let result = baseDetailItems.map((item)=>{
      let itemData = itemDetails.get(item.itemId);
      let shopData = shopDetails.get(item.shopId);
      return({
        id: (item.itemId+item.shopId),
        itemId: item.itemId,
        name: itemData?.name ?? "",
        shopId: item.shopId,
        shopName: shopData?.name ?? "",
        price: item.price
      });
  });

  return result;
}

//TODO: //this is logical because filtering is actually done on persistence level and not on app layer
//-remove filterfunction params, directly import it
//-add the portion for returning if there's exact match or not, added boolen value.
//OR MAYBE CHECK IF RETURN ARRAY IS ONLY 1

//notes: 2 cases, 
// noshopselected, searches all shops: if name is exact match query AND shop is equal to "none" 
// 1selectedshop: if name is exact match with query no need to show new option, cant just check if 1 is returned cause "apple" would return both "apple" and "apple pie"

function useShopItem(){
  let [isShopItemLoading, setIsShopItemLoading] = useState(false); // could cause problem since shared by multiple functions that could run at the same time(replace with a string based status), also with multiple calls of same function(should debounce)
  // multiple functions running could be solved by separating into different hooks, then debounce for same function running

  //add param exactMatchFunction, return value {shopItems: ShopItem[], hasExactMatch: boolean}
  async function fetchItemsInShopByName(shopId: string, nameQuery: string,){ // single shop
    setIsShopItemLoading(true);
    try{
      let result = await bbbdb.transaction('r', [bbbdb.items, bbbdb.shopItems, bbbdb.shops], async () => {
        let hasExactMatch = false;
        let emptyArray: ShopItem[] = []; // to rewrite better

        let itemsWithNameQuery = await fetchItemsByName(nameQuery);
        if(itemsWithNameQuery.length === 0) return({emptyArray, hasExactMatch});

        let itemDetails = new Map(itemsWithNameQuery.map(item => [item.id, item]));
        let itemIds = new Set(itemDetails.keys());

        let itemsInShop = await fetchShopItemsByShopId(shopId); //to support multiple shops in future
        if(itemsInShop.length === 0) return({emptyArray, hasExactMatch});

        let selectedShops = await fetchShopsById(shopId);
        if(selectedShops.length === 0) return({emptyArray, hasExactMatch});
        
        let shopDetails = new Map(selectedShops.map(shop => [shop.id, shop]));

        let itemsInShopWithNameQuery = itemsInShop.filter((item)=>FilterStrategies.filterByIdInSet(item,itemIds));

        let result = generateShopItems(itemsInShopWithNameQuery, itemDetails, shopDetails);
        if(result.length === 0 ){
          return({emptyArray, hasExactMatch});
        }

        // exactMatch is set regardless if matched item is part of page
        let itemNames = new Set(itemsWithNameQuery.map(item => item.name));
        hasExactMatch = itemNames.has(nameQuery);

        let page = 1;
        let offset = page - 1;
        let shopItems = result.slice(offset, offset + PAGE_SIZE);

        return({shopItems, hasExactMatch}); // to rewrite structure
      });

      return result;
    }
    catch(error){
      console.log("Error fetching Items:", error);
      return Promise.reject(); // THROW ERRORS INSTEAD OF THIS?
    }
    finally{
      setIsShopItemLoading(false);
    }
  }

  async function fetchItemsInAllShopsByName(nameQuery: string){
    setIsShopItemLoading(true);
    try{
      let result = await bbbdb.transaction('r', [bbbdb.items, bbbdb.shopItems, bbbdb.shops], async () => {
        let hasExactMatch = false;
        let emptyArray: ShopItem[] = []; // to rewrite better

        let itemsWithNameQuery = await fetchItemsByName(nameQuery);
        if(itemsWithNameQuery.length === 0) return({emptyArray, hasExactMatch});

        let itemDetails = new Map(itemsWithNameQuery.map(item => [item.id, item]));
        let itemIds = new Set(itemDetails.keys());

        let itemsInAllShops = await fetchAllShopItems();
        if(itemsInAllShops.length === 0) return({emptyArray, hasExactMatch});

        let allShops = await fetchAllShops();
        if(allShops.length === 0) return({emptyArray, hasExactMatch});
        
        let shopDetails = new Map(allShops.map(shop => [shop.id, shop]));

        let itemsInShopWithNameQuery = itemsInAllShops.filter((item)=>FilterStrategies.filterByIdInSet(item,itemIds));

        let result = generateShopItems(itemsInShopWithNameQuery, itemDetails, shopDetails);
        if(result.length === 0 ){
          return({emptyArray, hasExactMatch});
        }

        // exactMatch is set regardless if matched item is part of page
        let noneShop = await getNoneShop();
        if(noneShop){ //if name is exact match and it's shop is none, hasMatch = true = hide create option
          hasExactMatch = result.some((shopItem) => {
            return (
              shopItem.shopId === noneShop.id && 
              shopItem.name.trim().toLowerCase() === nameQuery.trim().toLowerCase()
            );
          });          
        }

        let page = 1;
        let offset = page - 1;
        let shopItems = result.slice(offset, offset + PAGE_SIZE);

        return {shopItems: shopItems, hasExactMatch: hasExactMatch};
      });

      return result;
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

  return {fetchItemsInShopByName, fetchItemsInAllShopsByName, createShopItem, isShopItemLoading};
}

export default useShopItem;

