import bbbdb, {
  generateId,
  ItemPersistStorage,
  ShopItemPersistStorage,
  ShopPersistStorage,
} from "../services/bbddb";
import { ShopItem } from "../data/models";
import { useState } from "react";

import { FilterStrategies } from "../utils/FilterStrategies";
import { PersistShops } from "../services/Shops";
import { PersistItems } from "../services/Items";
import { PersistShopItems } from "../services/ShopItems";
import { PagingStrategies } from "../utils/PagingStrategies";
import { matchedSortValue, shopItemMatchedSortValue } from "../utils/Utilities";

function generateShopItems(
  baseDetailItems: ShopItemPersistStorage[],
  itemDetails: Map<string, ItemPersistStorage>,
  shopDetails: Map<string, ShopPersistStorage>,
): ShopItem[] {
  let result = baseDetailItems.map((item) => {
    let itemData = itemDetails.get(item.itemId);
    let shopData = shopDetails.get(item.shopId);
    return {
      // Should put typing here so it would error new field is added
      id: item.itemId + item.shopId,
      itemId: item.itemId,
      name: itemData?.name ?? "",
      shopId: item.shopId,
      shopName: shopData?.name ?? "",
      price: item.price,
      barcode: itemData?.barcode,
    };
  });

  return result;
}

function useShopItem() {
  let [isShopItemLoading, setIsShopItemLoading] = useState(false); // could cause problem since shared by multiple functions that could run at the same time(replace with a string based status), also with multiple calls of same function(should debounce)
  // multiple functions running could be solved by separating into different hooks, then debounce for same function running

  async function fetchItemsInShopByNameQuery(
    shopId: string,
    nameQuery: string,
  ) {
    // single shop
    setIsShopItemLoading(true);
    let emptyArray: ShopItem[] = []; // to rewrite better
    let hasExactMatch = false;
    try {
      let result = await bbbdb.transaction(
        "r",
        [bbbdb.items, bbbdb.shopItems, bbbdb.shops],
        async () => {
          let itemsWithNameQuery =
            await PersistItems.fetchItemsByNameQuery(nameQuery);
          if (itemsWithNameQuery.length === 0)
            return { emptyArray, hasExactMatch };

          let itemDetails = new Map(
            itemsWithNameQuery.map((item) => [item.id, item]),
          );
          let itemIds = new Set(itemDetails.keys());

          let itemsInShop =
            await PersistShopItems.fetchShopItemsByShopId(shopId); //to support multiple shops in future
          if (itemsInShop.length === 0) return { emptyArray, hasExactMatch };

          let selectedShops = await PersistShops.fetchShopsById(shopId);
          if (selectedShops.length === 0) return { emptyArray, hasExactMatch };

          let shopDetails = new Map(
            selectedShops.map((shop) => [shop.id, shop]),
          );

          let itemsInShopWithNameQuery = itemsInShop.filter((item) =>
            FilterStrategies.filterByIdInSet(item, itemIds),
          );

          let result = generateShopItems(
            itemsInShopWithNameQuery,
            itemDetails,
            shopDetails,
          );
          if (result.length === 0) return { emptyArray, hasExactMatch };

          // exactMatch is set regardless if matched item is part of page
          let itemNames = new Set(itemsWithNameQuery.map((item) => item.name));
          hasExactMatch = itemNames.has(nameQuery);

          let { start, end } = PagingStrategies.pageIndices(0, result.length);
          let shopItems = result.slice(start, end);

          return { shopItems, hasExactMatch }; // to rewrite structure
        },
      );

      return {
        shopItems: result.shopItems ?? [],
        hasExactMatch: result.hasExactMatch,
      }; //TODO, write this BETTER
    } catch (error) {
      console.log("Error fetching Items:", error);
      return Promise.reject(); // THROW ERRORS INSTEAD OF THIS?
    } finally {
      setIsShopItemLoading(false);
    }
  }

  async function fetchItemsInAllShopsByNameQuery(nameQuery: string) {
    //setIsShopItemLoading(true);
    let hasExactMatch = false;
    let emptyArray: ShopItem[] = []; // to rewrite better
    //try{
    let result = await bbbdb.transaction(
      "r",
      [bbbdb.items, bbbdb.shopItems, bbbdb.shops],
      async () => {
        let itemsWithNameQuery =
          await PersistItems.fetchItemsByNameQuery(nameQuery);
        if (itemsWithNameQuery.length === 0)
          return { emptyArray, hasExactMatch };

        let itemDetails = new Map(
          itemsWithNameQuery.map((item) => [item.id, item]),
        );
        let itemIds = new Set(itemDetails.keys());

        let itemsInAllShops = await PersistShopItems.fetchAllShopItems();
        if (itemsInAllShops.length === 0) return { emptyArray, hasExactMatch };

        let allShops = await PersistShops.fetchAllShops();
        if (allShops.length === 0) return { emptyArray, hasExactMatch };

        let shopDetails = new Map(allShops.map((shop) => [shop.id, shop]));

        let itemsInShopWithNameQuery = itemsInAllShops.filter((item) =>
          FilterStrategies.filterByIdInSet(item, itemIds),
        );

        let result = generateShopItems(
          itemsInShopWithNameQuery,
          itemDetails,
          shopDetails,
        );
        if (result.length === 0) return { emptyArray, hasExactMatch };

        //BUG: searching item existing in another store, when a different store is selected does not show create new option(observed in items existing in "NONE shop")

        result.sort((a, b) => a.name.localeCompare(b.name));
        // exactMatch is set regardless if matched item is part of page
        let noneShop = await PersistShops.getNoneShop();
        if (noneShop) {
          //if name is exact match and it's shop is none, hasMatch = true = hide create option
          hasExactMatch = result.some((shopItem) => {
            return (
              shopItem.shopId === noneShop.id &&
              shopItem.name.trim().toLowerCase() ===
                nameQuery.trim().toLowerCase()
            );
          });

          if (hasExactMatch) {
            result.sort(
              (a, b) =>
                shopItemMatchedSortValue(a, nameQuery, noneShop.id) -
                shopItemMatchedSortValue(b, nameQuery, noneShop.id),
            );
          }
        } else {
          if (hasExactMatch) {
            result.sort(
              (a, b) =>
                matchedSortValue(a.name, nameQuery) -
                matchedSortValue(b.name, nameQuery),
            );
          }
        }

        let { start, end } = PagingStrategies.pageIndices(0, result.length);
        let shopItems = result.slice(start, end) ?? [];

        return { shopItems, hasExactMatch };
      },
    );
    return {
      shopItems: result.shopItems ?? [],
      hasExactMatch: result.hasExactMatch,
    }; //TODO, write this BETTER
    //return result as {shopItems: ShopItem[], hasExactMatch: boolean};
    //}
    //catch(error){
    //  console.log("Error fetching Items:", error);
    //return Promise.reject();
    //  throw error;
    //}
    //finally{
    //setIsShopItemLoading(false);
    //}
  }

  async function createShopItem({
    shopId,
    newItemName,
  }: {
    shopId?: string;
    newItemName: string;
  }) {
    //TO REFACTOR
    setIsShopItemLoading(true);
    try {
      let result = await bbbdb.transaction(
        "rw",
        [bbbdb.items, bbbdb.shopItems, bbbdb.shops],
        async () => {
          if (!shopId) {
            let noShop = await PersistShops.getNoneShop();
            if (noShop) {
              shopId = noShop.id;
            } else {
              throw new Error("Missing empty shop instance, Select a store");
            }
          }

          let existingItem = await bbbdb.items.get({ name: newItemName });

          let ItemId = "";
          if (existingItem) {
            ItemId = existingItem.id;
          } else {
            ItemId = await bbbdb.items.add({
              id: generateId(),
              name: newItemName,
              updatedAt: new Date(Date.now()),
            });
          }

          let shopItemId = await bbbdb.shopItems.add({
            itemId: ItemId,
            shopId: shopId,
            price: 0,
            updatedAt: new Date(Date.now()),
          });

          let item = await bbbdb.items.get(ItemId);
          let shopItem = await bbbdb.shopItems.get(shopItemId);
          let shop = await bbbdb.shops.get(shopId);
          let mergedId = (shopItem?.itemId ?? "") + shopItem?.shopId;

          let merged = {
            id: mergedId,
            ...shopItem,
            shopName: shop?.name,
            name: item?.name,
          }; //to fix/refactor

          return merged;
        },
      ); //didnt error when no shop id(non selected on ui) was provided

      return result as ShopItem;
    } catch (error) {
      console.error("Failed to add Item: " + error);
      return Promise.reject();
    } finally {
      setIsShopItemLoading(false);
    }
  }

  return {
    fetchItemsInShopByNameQuery,
    fetchItemsInAllShopsByNameQuery,
    createShopItem,
    isShopItemLoading,
  };
}

export default useShopItem;
