import { FilterStrategies } from "../utils/FilterStrategies";
import bbbdb from "./bbddb";

export namespace PersistItems {
  export async function fetchItemsByNameQuery(nameQuery: string) {
    let items = await bbbdb.items
      .filter((item) => FilterStrategies.filterByName(item, nameQuery))
      .toArray();
    return items;
  }

  export async function getItemByBarcode(scannedBarcode: string) {
    let scannedItem = await bbbdb.items.get({ barcode: scannedBarcode });
    return scannedItem;
  }

  export async function addBarcode(itemId: string, scannedBarcode: string) {
    let barcodeAlreadyInUse = await getItemByBarcode(scannedBarcode); // maybe not needed since unique is checked on db level
    if (barcodeAlreadyInUse) {
      // toast here
      return; // error out which Item uses it
    }

    await bbbdb.items.update(itemId, { barcode: scannedBarcode });
  }
}
