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

  export async function updateShopItemPrice(
    itemId: string,
    shopId: string,
    newPrice: number,
  ) {
    //@ts-expect-error
    let updatedItem = await bbbdb.shopItems.update([shopId, itemId], {
      price: newPrice,
    });
  }
}
