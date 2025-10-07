import { BasketItem, ShopItem } from "../data/models";
import BBItemSearch from "./BBItemSearch";
import BBList from "../components/BBList/BBList";
import { useState } from "react";
import { BASKET_ITEM_STATUS } from "../services/bbddb";
import useBasketItem from "../hooks/useBasketItem";
import {
  ArchiveX,
  ShoppingBasket,
  ShoppingCart,
  Trash,
  Trash2,
} from "lucide-react";
import BagList from "../components/Bag/BagList";

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
    //if (
    //  confirm(
    //    "Are you sure you want to delete all picked and unpicked items in your basket?",
    //  ) == true
    //) {
    emptyBasket();
    //}
  }

  function handleEmptyBag() {
    setIsPicking((isPicking) => !isPicking);
    deleteBaggedItems();
  }

  function handlePickMore() {
    setIsPicking((isPicking) => !isPicking);
  }

  //TODO:DONE Suggestion Details, BugFix and UI
  //TODO:DONE Edit Price function
  //TODO: Shop Record Management(Edit Name, Delete Shop, etc)
  //TODO: Item Record Management(Edit Name, Delete Item/ShopItem, etc)

  return (
    <div className="flex h-full flex-col bg-neutral-100 pt-4 pb-2">
      {isPicking ? (
        <>
          <div className="flex-grow-0">
            <BBItemSearch onAddAction={handleAddItem} />
          </div>

          <div className="flex-grow-1 overflow-x-hidden overflow-y-auto bg-neutral-100">
            {liveBasket.reduce(
              (count, item) =>
                item.status !== BASKET_ITEM_STATUS.BAGGED ? count + 1 : count,
              0,
            ) === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="rounded-lg border-4 border-dashed p-10 text-xl opacity-20">
                  Your Basket is Empty
                </div>
              </div>
            ) : (
              <BBList
                liveBasket={liveBasket}
                removeItem={handleRemoveItem}
                checkItem={handleItemCheck}
                reOrderItems={handleItemReorder}
              />
            )}
          </div>

          <div className="mt-auto flex justify-center gap-2 border-t-1 bg-neutral-100 pt-2">
            <button
              onClick={handleEmptyBasket}
              className={`inline-flex cursor-pointer touch-manipulation flex-col items-center justify-center gap-1 rounded-lg px-3 py-1 transition-all hover:bg-gray-200 active:scale-90 active:ring-2 active:ring-gray-200 active:outline-none`}
              aria-label="Empty basket"
            >
              <Trash2 className="flex-shrink-0 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">
                Empty Basket
              </span>
            </button>

            <button
              onClick={handleRemoveUnpicked}
              className={`inline-flex cursor-pointer touch-manipulation flex-col items-center justify-center gap-1 rounded-lg px-3 py-1 transition-all hover:bg-gray-200 active:scale-90 active:ring-2 active:ring-gray-200 active:outline-none`}
              aria-label="Empty basket"
            >
              <Trash className="flex-shrink-0 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">
                Remove Unpicked
              </span>
            </button>

            <button
              onClick={handleDonePicking}
              className={`inline-flex cursor-pointer touch-manipulation flex-col items-center justify-center gap-1 rounded-lg px-3 py-1 transition-all hover:bg-gray-200 active:scale-90 active:ring-2 active:ring-gray-200 active:outline-none`}
              aria-label="Empty basket"
            >
              <ShoppingCart className="flex-shrink-0 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">
                Done Picking
              </span>
            </button>
          </div>
        </>
      ) : null}
      {isPicking ? null : (
        <div
          className={
            "flex h-full flex-col bg-neutral-100 " +
            (isPicking ? "mt-auto" : "flex-grow-1")
          }
        >
          {liveBasket.reduce(
            (count, item) =>
              item.status === BASKET_ITEM_STATUS.BAGGED ? count + 1 : count,
            0,
          ) === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="rounded-lg border-4 border-dashed p-10 text-xl opacity-20">
                Your Bag is Empty
              </div>
            </div>
          ) : (
            <>
              <div className="flex border-b-1 px-2">
                <div className="flex-1">
                  <span>Number of Items:</span>
                  <span className="font-medium">
                    {liveBasket.reduce(
                      (count, item) =>
                        item.status === BASKET_ITEM_STATUS.BAGGED
                          ? count + 1
                          : count,
                      0,
                    )}
                  </span>
                </div>
                <div className="flex-1">
                  <span>Total Price:</span>
                  <span className="font-medium">
                    &#8369;
                    {liveBasket
                      .reduce(
                        (total, item) =>
                          item.status === BASKET_ITEM_STATUS.BAGGED
                            ? total + (item?.price ?? 0)
                            : total,
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
              <BagList basket={liveBasket} removeItem={handleRemoveItem} />
            </>
          )}
          <div className="mt-auto flex justify-center gap-2 border-t-1 bg-neutral-100 pt-2">
            <button
              onClick={handleEmptyBag}
              className={`inline-flex cursor-pointer touch-manipulation flex-col items-center justify-center gap-1 rounded-lg px-3 py-1 transition-all hover:bg-gray-200 active:scale-90 active:ring-2 active:ring-gray-200 active:outline-none`}
              aria-label="Empty basket"
            >
              <ArchiveX className="flex-shrink-0 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">
                Empty Bag
              </span>
            </button>

            <button
              onClick={handlePickMore}
              className={`inline-flex cursor-pointer touch-manipulation flex-col items-center justify-center gap-1 rounded-lg px-3 py-1 transition-all hover:bg-gray-200 active:scale-90 active:ring-2 active:ring-gray-200 active:outline-none`}
              aria-label="Empty basket"
            >
              <ShoppingBasket className="flex-shrink-0 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">
                Pick More Items
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default BBBasket;
