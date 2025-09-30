import bbbdb from "./bbddb";

export namespace PersistShopItems {
  export async function fetchShopItemsByShopId(shopId: string) {
    let shopItems = await bbbdb.shopItems
      .where("shopId")
      .anyOf([shopId])
      .toArray();
    return shopItems;
  }

  export async function fetchAllShopItems() {
    let shopItems = await bbbdb.shopItems.toArray();
    return shopItems;
  }
}
