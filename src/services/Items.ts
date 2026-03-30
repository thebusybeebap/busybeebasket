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

  export async function getItemByBarcode(scannedBarcode: string) {
    let scannedItem = await bbbdb.items.get({ barcode: scannedBarcode });
    return scannedItem;
  }

  export async function addBarcode(itemId: string, scannedBarcode: string) {
    await bbbdb.items.update(itemId, { barcode: scannedBarcode });
  }
}
