import { BasketItem } from "../data/models";
import bbbdb, {
  BASKET_ITEM_STATUS,
  BasketItemPersistStorage,
  generateId,
} from "./bbddb";

async function _basketPositionMoveByOne(
  currentItems: BasketItemPersistStorage[],
) {
  let movedItems = currentItems.map((item) => ({
    key: item.id,
    changes: { position: item.position + 1, updatedAt: new Date(Date.now()) },
  }));
  await bbbdb.basketItems.bulkUpdate(movedItems);
}

export namespace PersistBasketItems {
  export function basketItemsPositionedLiveFetch() {
    return bbbdb.basketItems.orderBy("position").toArray();
  }

  //TODO: Should I NOT USE useLiveQuery
  export async function basketPositionReIndexed(currentItems: BasketItem[]) {
    let reIndexedItems = currentItems.map((item, index) => ({
      key: item.id,
      changes: { position: index, updatedAt: new Date(Date.now()) },
    }));
    await bbbdb.basketItems.bulkUpdate(reIndexedItems);
  }

  export async function addItemToBasket(item: BasketItem) {
    await bbbdb.transaction("rw", bbbdb.basketItems, async () => {
      let currentItems = await bbbdb.basketItems.orderBy("position").toArray();

      _basketPositionMoveByOne(currentItems);

      let newItem = {
        id: generateId(),
        shopId: item.shopId,
        itemId: item.itemId,
        price: item.price,
        name: item.name,
        shopName: item.shopName,
        status: BASKET_ITEM_STATUS.UNPICKED,
        updatedAt: new Date(Date.now()),
        position: 0,
      };

      let id = await bbbdb.basketItems.add(newItem as BasketItemPersistStorage);
      return id;
    });
  }

  export async function deleteBasketItem(id: string) {
    await bbbdb.transaction("rw", bbbdb.basketItems, async () => {
      await bbbdb.basketItems.delete(id);
      let currentItems = await bbbdb.basketItems.orderBy("position").toArray();
      basketPositionReIndexed(currentItems);
    });
  }

  export async function updateBasketItemStatus( //NO REINDEXING NEEDED WHEN UPDATING STATUS
    id: string,
    newStatus: BASKET_ITEM_STATUS,
  ) {
    await bbbdb.basketItems.update(id, {
      status: newStatus,
      updatedAt: new Date(Date.now()),
    });
  }

  export async function deleteUnbaggedItems() {
    await bbbdb.basketItems
      .where("status")
      .anyOf(BASKET_ITEM_STATUS.UNPICKED, BASKET_ITEM_STATUS.PICKED)
      .delete();
  }

  export async function deleteUnpickedItems() {
    await bbbdb.basketItems
      .where("status")
      .equals(BASKET_ITEM_STATUS.UNPICKED)
      .delete();
  }

  export async function deletePickedItems() {
    await bbbdb.basketItems
      .where("status")
      .equals(BASKET_ITEM_STATUS.PICKED)
      .delete();
  }

  export async function bagPickedItems() {
    await bbbdb.basketItems
      .where("status")
      .equals(BASKET_ITEM_STATUS.PICKED)
      .modify({
        status: BASKET_ITEM_STATUS.BAGGED,
        updatedAt: new Date(Date.now()),
      });
  }

  export async function deleteBaggedItems() {
    await bbbdb.basketItems
      .where("status")
      .equals(BASKET_ITEM_STATUS.BAGGED)
      .delete();
  }

  export async function updateBasketItemPrice(id: string, newPrice: number) {
    let updatedItem = await bbbdb.basketItems.update(id, {
      price: newPrice,
    });
  }
}
