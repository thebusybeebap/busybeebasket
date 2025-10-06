import { BasketItem, ShopItem } from "../data/models";
import BBItemSearch from "./BBItemSearch";
import BBList from "../components/BBList/BBList";
import { useState } from "react";
import { BASKET_ITEM_STATUS } from "../services/bbddb";
import useBasketItem from "../hooks/useBasketItem";
import { ShoppingBasket, ShoppingCart, Trash, Trash2 } from "lucide-react";

function BBBasket() {
  let {
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
  } = useBasketItem();

  let [isPicking, setIsPicking] = useState(true);

  function handleAddItem(itemToAdd: ShopItem) {
    addItemToBasket(itemToAdd as BasketItem);
  }

  function handleRemoveItem(id: string) {
    removeItemFromBasket(id);
  }

  function handleItemCheck(id: string) {
    if (liveBasket) {
      let itemToCheck = liveBasket.find((item) => item.id === id);
      if (itemToCheck?.status === BASKET_ITEM_STATUS.PICKED) {
        updateBasketItemStatus(id, BASKET_ITEM_STATUS.UNPICKED);
      } else if (itemToCheck?.status === BASKET_ITEM_STATUS.UNPICKED) {
        updateBasketItemStatus(id, BASKET_ITEM_STATUS.PICKED);
      }
    }
  }

  function handleItemReorder(reOrderedItems: BasketItem[]) {
    itemReorder(reOrderedItems);
  }

  function handleDonePicking() {
    setIsPicking((isPicking) => !isPicking);
    bagPickedItems();
  }

  function handleRemoveUnpicked() {
    deleteUnpickedItems();
  }

  function handleEmptyBasket() {
    emptyBasket();
  }

  function handleEmptyBag() {
    setIsPicking((isPicking) => !isPicking);
    deleteBaggedItems();
  }

  function handlePickMore() {
    setIsPicking((isPicking) => !isPicking);
  }

  return (
    <div className="flex h-full flex-col bg-green-900 py-4">
      <div className="flex-grow-0">
        <BBItemSearch onAddAction={handleAddItem} />
      </div>
      {isPicking ? (
        <>
          <div className="flex-grow-1 overflow-x-hidden overflow-y-auto bg-teal-300">
            <BBList
              liveBasket={liveBasket}
              removeItem={handleRemoveItem}
              checkItem={handleItemCheck}
              reOrderItems={handleItemReorder}
            />
          </div>

          <div className="mt-auto flex gap-2 bg-orange-600">
            <button
              className="flex-1 rounded-md border-1 bg-red-800"
              onClick={handleEmptyBasket}
            >
              <Trash2 />
              Empty Basket
            </button>
            <button
              className="flex-1 rounded-md border-1 bg-orange-800"
              onClick={handleRemoveUnpicked}
            >
              <Trash />
              Remove Unpicked
            </button>
            <button
              className="flex-1 rounded-md border-1 bg-green-800"
              onClick={handleDonePicking}
            >
              <ShoppingCart />
              Done Picking
            </button>
          </div>
        </>
      ) : null}
      {isPicking ? null : (
        <div
          className={
            "flex h-full flex-col bg-gray-600 " +
            (isPicking ? "mt-auto" : "flex-grow-1")
          }
        >
          <ul className="w-full">
            {liveBasket.map((item: BasketItem) =>
              item.status === BASKET_ITEM_STATUS.BAGGED ? (
                <li>{item.name}</li>
              ) : null,
            )}
          </ul>

          <div className="mt-auto flex gap-2 bg-orange-600">
            <button
              className="flex-1 rounded-md border-1 bg-red-800"
              onClick={handleEmptyBag}
            >
              <Trash2 />
              Empty Bag
            </button>
            <button
              className="flex-1 rounded-md border-1 bg-blue-800"
              onClick={handlePickMore}
            >
              <ShoppingBasket />
              Pick More Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default BBBasket;
