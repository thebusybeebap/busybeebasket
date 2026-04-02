import { FilterStrategies } from "../utils/FilterStrategies";
import bbbdb from "./bbddb";

export namespace PersistItems {
  export async function fetchItemsByNameQuery(nameQuery: string) {
    let items = await bbbdb.items
      .filter((item) => FilterStrategies.filterByName(item, nameQuery))
      .toArray();
    return items;
  }

  export async function getItemById(ItemId: string) {
    let item = await bbbdb.items.get(ItemId);
    return item;
  }
  
  export async function fetchItemsById(itemIds: string[]) {  
    let items = await bbbdb.items.where("id").anyOf(itemIds).toArray();
    return items;
  }

  export async function getItemByBarcode(scannedBarcode: string) {
    let scannedItem = await bbbdb.items.get({ barcode: scannedBarcode });
    return scannedItem;
  }

  export async function addBarcode(itemId: string, scannedBarcode: string) {
    await bbbdb.items.update(itemId, { barcode: scannedBarcode });
  }

  export async function deleteItem(id: string){
    let itemDeletionResult = await bbbdb.transaction("rw", [bbbdb.basketItems, bbbdb.items, bbbdb.shopItems], 
      async () => {
        let forSoftDelete = await bbbdb.basketItems.where('itemId').equals(id).first();
        if(forSoftDelete){
          let item = await bbbdb.items.get(id);
          await bbbdb.items.update(id, { name: '[DELETED]' + (item?.name ?? "") , isDeleted: true });
        }
        else {
          await bbbdb.items.delete(id);
        }
        let shopCount = await bbbdb.shopItems.where('itemId').equals(id).delete();
        return shopCount;
      });
    return itemDeletionResult;
  }

  export async function renameItem(itemId: string, newName: string){
    let itemRenameResult = await bbbdb.transaction("rw", [bbbdb.basketItems, bbbdb.items, bbbdb.shopItems], 
      async () => {
          await bbbdb.items.update(itemId, { name: newName});
          await bbbdb.basketItems.where('itemId').equals(itemId).modify({ name: newName});
      });
    return itemRenameResult;
  }
}
