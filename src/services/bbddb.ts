import Dexie, { type EntityTable } from "dexie";
import { v7 as uuidv7 } from "uuid"; // transfer id generation here, create a fucntion to be called by custom

export enum BASKET_ITEM_STATUS {
  UNPICKED,
  PICKED,
  BAGGED,
}

export function generateId() {
  return uuidv7();
}

// persist layer data models
export interface ShopPersistStorage {
  //naming convention for Interface from 'db'
  id: string;
  name: string;
  updatedAt: Date;
}

export interface ItemPersistStorage {
  id: string;
  name: string;
  barcode?: string;
  updatedAt: Date;
}

export interface ShopItemPersistStorage {
  shopId: string;
  itemId: string;
  price: number;
  updatedAt: Date;
}

export interface BasketItemPersistStorage {
  id: string;
  name: string;
  shopId: string;
  itemId: string;
  shopName: string;
  status: BASKET_ITEM_STATUS;
  price: number;
  updatedAt: Date;
  position: number;
}

const bbbdb = new Dexie("BBBasketDB") as Dexie & {
  shops: EntityTable<ShopPersistStorage, "id">;
  items: EntityTable<ItemPersistStorage, "id">;
  // @ts-expect-error // NEED TO FIND A PROPER FIX FOR THIS
  shopItems: EntityTable<ShopItemPersistStorage, ["shopId", "itemId"]>;
  basketItems: EntityTable<BasketItemPersistStorage, "id">;
};

bbbdb.version(1).stores({
  shops: "&id, &name, updatedAt",
  items: "&id, &name, &barcode, updatedAt",
  shopItems: "&[shopId+itemId], shopId, itemId, updatedAt",
  basketItems: "&id, [shopId+itemId], status, position",
});

bbbdb.on("populate", function (transaction) {
  //Items with no Shops
  transaction.table("shops").add({ id: generateId(), name: "NONE" });
});

export default bbbdb;
