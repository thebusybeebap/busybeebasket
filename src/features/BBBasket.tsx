import { BasketItem, ShopItem } from "../data/models";
import BBItemSearch from "./BBItemSearch";
import BBList from "../components/BBList/BBList";
import { useState } from "react";
import { BASKET_ITEM_STATUS } from "../services/bbddb";
import useBasketItem from "../hooks/useBasketItem";

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

  return (
    <div className="flex h-full flex-col bg-green-900">
      <div className="h-4 bg-green-400"></div>

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

          <div className="mt-auto bg-orange-600">
            <button>Empty Basket - all items</button>
            <button>Remove Unpicked - delete unchecked</button>
            <button onClick={() => setIsPicking((isPicking) => !isPicking)}>
              Done Picking - move checked to Bought - opens Picked Items
            </button>
          </div>
        </>
      ) : null}
      <div className={"bg-gray-600 " + (isPicking ? "mt-auto" : "flex-grow-1")}>
        <button>Pick More Items</button>
        {/*isPicking ? null : (
          <ul className="w-full">
            {basket?.map((item: BasketItem) =>
              item.status === BASKET_ITEM_STATUS.BAGGED ? (
                <li>{item.name}</li>
              ) : null,
            )}
          </ul>
        )*/}
      </div>
    </div>
  );
}
export default BBBasket;
