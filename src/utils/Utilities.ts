import { ShopItem } from "../data/models";

export function cleanString(str: string) {
  return str.trim().toLowerCase();
}

export function matchedSortValue(str1: string, str2: string) {
  if (cleanString(str1) === cleanString(str2)) {
    return 1;
  } else {
    return 2;
  }
}

export function shopItemMatchedSortValue(
  shopItem: ShopItem,
  nameQuery: string,
  shopId: string,
) {
  if (
    cleanString(shopItem.name) === cleanString(nameQuery) &&
    shopItem.shopId === shopId
  ) {
    return 1;
  } else if (
    cleanString(shopItem.name) === cleanString(nameQuery) ||
    shopItem.shopId === shopId
  ) {
    return 2;
  } else {
    return 3;
  }
}
