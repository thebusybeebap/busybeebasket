// application layer data models
import { v7 as uuidv7 } from "uuid";

import { BBSearchable } from "../components/BBAutocomplete";
import { BASKET_ITEM_STATUS } from "../services/bbddb";

export function generateId() {
  return uuidv7();
}

export interface BasketItem {
  id: string; // key: generated id
  itemId: string; //key
  name: string;
  price?: number;
  shopId: string; //key
  shopName: string;
  status: BASKET_ITEM_STATUS;
  position: number;
}

export interface Shop extends BBSearchable {
  id: string; //key
  name: string;
}

export interface ShopItem extends BBSearchable {
  id: string; // key: itemId + shopId
  itemId: string;
  name: string; //itemName
  shopId: string;
  shopName: string;
  price?: number;
}
