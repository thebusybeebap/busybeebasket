import { useLiveQuery } from "dexie-react-hooks";
import { PersistBasketItems } from "../services/BasketItems";
import { BasketItem } from "../data/models";
import { BASKET_ITEM_STATUS } from "../services/bbddb";

function useBasketItem() {
  let liveBasket = useLiveQuery(
    PersistBasketItems.basketItemsPositionedLiveFetch,
    [],
    [] as BasketItem[],
  );

  async function addItemToBasket(item: BasketItem) {
    await PersistBasketItems.addItemToBasket(item);
  }

  async function removeItemFromBasket(id: string) {
    await PersistBasketItems.deleteBasketItem(id);
  }

  async function itemReorder(reOrderedItems: BasketItem[]) {
    PersistBasketItems.basketPositionReIndexed(reOrderedItems);
  }

  async function updateBasketItemStatus(
    id: string,
    newStatus: BASKET_ITEM_STATUS,
  ) {
    await PersistBasketItems.updateBasketItemStatus(id, newStatus);
  }

  async function emptyBasket() {
    await PersistBasketItems.deleteUnbaggedItems();
  }

  async function deleteUnpickedItems() {
    await PersistBasketItems.deleteUnpickedItems();
  }

  async function deletePickedItems() {
    await PersistBasketItems.deletePickedItems();
  }

  async function bagPickedItems() {
    await PersistBasketItems.bagPickedItems();
  }

  async function deleteBaggedItems() {
    await PersistBasketItems.deleteBaggedItems();
  }

  return {
    liveBasket,
    addItemToBasket,
    removeItemFromBasket,
    itemReorder,
    updateBasketItemStatus,
    emptyBasket,
    deleteUnpickedItems,
    deletePickedItems,
    bagPickedItems,
    deleteBaggedItems,
  };
}

export default useBasketItem;
