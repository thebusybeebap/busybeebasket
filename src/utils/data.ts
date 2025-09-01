import { BBSearchable } from "../ui/BBAutocomplete";

export interface BasketItem {
  id: string; // key: itemId + storeId
  itemId: string; //key
  name: string;
  price?: number;
  storeId?: string; //key
  storeName?: string;
}

export interface Store extends BBSearchable {
  id: string; //key
  name: string;
}

export interface Item {
  id: string; //key
  name: string;
}

export interface StoreItemDB {
  itemId: string;
  storeId: string;
  price?: number;
}

export interface StoreItem extends BBSearchable {
  id: string; // key: itemId + storeId
  itemId: string;
  name: string; //itemName
  storeId?: string;
  storeName?: string;
  price?: number; //StoreItemPrice
}

let storeList: Store[] = [
  {
    id: "z",
    name: "-",
  },
  {
    id: "a",
    name: "SM Aura",
  },
  {
    id: "b",
    name: "Market Market",
  },
  {
    id: "c",
    name: "Rob - Stamford",
  },
  {
    id: "d",
    name: "The Marketplace - Venice",
  },
  {
    id: "e",
    name: "The Marketplace - Uptown Mall",
  },
  {
    id: "f",
    name: "The Landmark - BGC",
  },
  {
    id: "g",
    name: "Watsons - Stamford",
  },
  {
    id: "h",
    name: "Alphamart - Woodridge",
  },
  {
    id: "i",
    name: "Daiso - Mitsukoshi BGC",
  },
];

let itemList: Item[] = [
  {
    id: "1",
    name: "Body Wash - Safeguard - 1L",
  },
  {
    id: "2",
    name: "Pandan Rice - Farmboy - 5KG",
  },
  {
    id: "3",
    name: "Soy Sauce - Datu Puti - 1L",
  },
  {
    id: "4",
    name: "Vinegar - Silver Swan - 1L",
  },
  {
    id: "5",
    name: "Chicken - Magnolia - 1KG",
  },
  {
    id: "6",
    name: "Coffee Filter - Daiso - 100PCS",
  },
  {
    id: "7",
    name: "Ground Coffee - SilCafe - 250G",
  },
  {
    id: "8",
    name: "Garlic",
  },
  {
    id: "9",
    name: "Onion",
  },
  {
    id: "10",
    name: "Ginger",
  },
  {
    id: "11",
    name: "Bar Soap - Safeguard",
  },
  {
    id: "12",
    name: "Liquid Hand Soap - Daiso",
  },
  {
    id: "13",
    name: "Water - 1Gallon",
  },
  {
    id: "14",
    name: "French Bread - Half",
  },
  {
    id: "15",
    name: "Croisant - 3PCS",
  },
];

let storeItemDBList: StoreItemDB[] = [
  {
    itemId: "1",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "1",
    storeId: "b",
    price: 100.0,
  },
  {
    itemId: "1",
    storeId: "c",
    price: 100.0,
  },
  {
    itemId: "1",
    storeId: "d",
    price: 100.0,
  },
  {
    itemId: "1",
    storeId: "e",
    price: 100.0,
  },
  {
    itemId: "1",
    storeId: "f",
    price: 100.0,
  },
  {
    itemId: "1",
    storeId: "g",
    price: 100.0,
  },
  {
    itemId: "2",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "3",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "3",
    storeId: "b",
    price: 100.0,
  },
  {
    itemId: "3",
    storeId: "c",
    price: 100.0,
  },
  {
    itemId: "4",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "4",
    storeId: "b",
    price: 100.0,
  },
  {
    itemId: "4",
    storeId: "c",
    price: 100.0,
  },
  {
    itemId: "4",
    storeId: "d",
    price: 100.0,
  },
  {
    itemId: "4",
    storeId: "e",
    price: 100.0,
  },
  {
    itemId: "4",
    storeId: "f",
    price: 100.0,
  },
  {
    itemId: "4",
    storeId: "h",
    price: 100.0,
  },
  {
    itemId: "5",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "5",
    storeId: "c",
    price: 100.0,
  },
  {
    itemId: "6",
    storeId: "i",
    price: 100.0,
  },
  {
    itemId: "7",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "7",
    storeId: "b",
    price: 100.0,
  },
  {
    itemId: "7",
    storeId: "d",
    price: 100.0,
  },
  {
    itemId: "7",
    storeId: "e",
    price: 100.0,
  },
  {
    itemId: "8",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "8",
    storeId: "d",
    price: 100.0,
  },
  {
    itemId: "8",
    storeId: "h",
    price: 100.0,
  },
  {
    itemId: "9",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "9",
    storeId: "d",
    price: 100.0,
  },
  {
    itemId: "9",
    storeId: "h",
    price: 100.0,
  },
  {
    itemId: "10",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "10",
    storeId: "d",
    price: 100.0,
  },
  {
    itemId: "10",
    storeId: "h",
    price: 100.0,
  },
  {
    itemId: "11",
    storeId: "a",
    price: 100.0,
  },
  {
    itemId: "11",
    storeId: "b",
    price: 100.0,
  },
  {
    itemId: "11",
    storeId: "c",
    price: 100.0,
  },
  {
    itemId: "11",
    storeId: "d",
    price: 100.0,
  },
  {
    itemId: "11",
    storeId: "e",
    price: 100.0,
  },
  {
    itemId: "11",
    storeId: "f",
    price: 100.0,
  },
  {
    itemId: "11",
    storeId: "g",
    price: 100.0,
  },
  {
    itemId: "12",
    storeId: "i",
    price: 100.0,
  },
  {
    itemId: "13",
    storeId: "z",
  },
  {
    itemId: "14",
    storeId: "c",
    price: 100.0,
  },
  {
    itemId: "14",
    storeId: "d",
    price: 100.0,
  },
  {
    itemId: "14",
    storeId: "e",
    price: 100.0,
  },
  {
    itemId: "15",
    storeId: "c",
    price: 100.0,
  },
  {
    itemId: "15",
    storeId: "d",
    price: 100.0,
  },
  {
    itemId: "15",
    storeId: "e",
    price: 100.0,
  },
];

let storeItemList: StoreItem[] = [];

function getStores(ItemId?: string) {
  //store search suggestions, optional itemId for filter if an Item is currently selected

  //query Stores [and StoreItems if itemId specified]
  let result: Store[] = [];

  if (ItemId) {
    result = storeList.filter((store) => {
      let storeHasItem = false;
      storeHasItem = storeItemDBList.some(
        (item) => item.itemId === ItemId && item.storeId === store.id
      );
      if (storeHasItem) return store;
    });
  } else {
    return storeList;
  }

  return result;
}

function getStoreItems(storeId?: string) {
  //item search suggestions, optional storeId for filter if a Store is currently selected
  //query StoreItems [and StoreItems if storeId specified]
  let result: StoreItem[] | undefined;
  //let storeName = storeList.find((store) => store.id === storeId);
  result = storeItemDBList.map((item) => {
    let itemData: StoreItem;
    let computedId = item.itemId + (storeId ?? "");
    let itemName = itemList.find((data) => data.id === item.itemId);
    let storeName = storeList.find((store) => store.id === item.storeId);

    itemData = {
      id: computedId,
      itemId: item.itemId,
      name: itemName?.name ?? "",
      storeId: item.storeId,
      storeName: storeName?.name ?? "",
      price: item.price,
    };
    return itemData;
  });

  return result;
}
/*
export interface StoreItemDB {
  itemId: string;
  storeId: string;
  price?: number;
}

export interface StoreItem extends BBSearchable {
  id: string; // key: itemId + storeId
  itemId: string;
  name: string; //itemName
  storeId?: string;
  storeName?: string;
  price?: number; //StoreItemPrice
}

storeItemDBList.map((item) => {
  if (item.storeId === storeId) {
    return {
      id: item.storeId + storeId,
      itemId: item.storeId,
      name:
        itemList.find((itemInList) => itemInList.id === item.storeId)?.name ??
        "",
      storeId: item.storeId,
      storeName: storeList.find(
        (storeInList) => storeInList.id === item.storeId
      )?.name,
      price: item.price,
    };
  }
});*/

export default function dummyDataAPI() {
  return { getStoreItems, getStores };
}
