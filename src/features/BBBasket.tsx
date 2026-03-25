import { BasketItem, ShopItem } from "../data/models";
import BBItemSearch from "./BBItemSearch";
import BBList from "../components/BBList/BBList";
import { useState } from "react";
import { BASKET_ITEM_STATUS } from "../services/bbddb";
import useBasketItem from "../hooks/useBasketItem";
import {
  ArchiveX,
  Settings2,
  ShoppingBasket,
  ShoppingCart,
  Trash,
  Trash2,
} from "lucide-react";
import BagList from "../components/Bag/BagList";
import BouncyButton from "../components/ui/BouncyButton";

//replace source of list data depends on the mode?

function BBBasket() {
  let {
    liveBasket,
    addItemToBasket,
    removeItemFromBasket,
    itemReorder,
    updateBasketItemStatus,
    emptyBasket,
    deleteUnpickedItems,
    //deletePickedItems,
    bagPickedItems,
    deleteBaggedItems,
  } = useBasketItem();

  let listCount = liveBasket.reduce((count, item) => 
      item.status !== BASKET_ITEM_STATUS.BAGGED ? count + 1 : count, 0);

  let basketCount = liveBasket.reduce((count, item) =>
      item.status === BASKET_ITEM_STATUS.BAGGED ? count + 1 : count, 0);

  let unpickedCount = liveBasket.reduce((count, item) => 
      item.status === BASKET_ITEM_STATUS.UNPICKED ? count + 1 : count, 0);

  let baggedItemsTotalPrice = liveBasket.reduce((total, item) => item.status === BASKET_ITEM_STATUS.BAGGED ? total + (item.price ?? 0) : total, 0);

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

  function handleListOptions(){
    return;
  }

  function openRecordManagement(){
    return;
  }

  //TODO:DONE Suggestion Details, BugFix and UI
  //TODO:DONE Edit Price function
  //TODO: Shop Record Management(Edit Name, Delete Shop, etc)
  //TODO: Item Record Management(Edit Name, Delete Item/ShopItem, etc)

  return(
    <div className="h-full grid grid-rows-[auto_1fr_auto_auto]">
      <div className="bg-bb-prim">
        {isPicking ? 
          <BBItemSearch onAddAction={handleAddItem} onExploreAction={openRecordManagement} /> 
          : null}
      </div>

      <div className="overflow-x-hidden overflow-y-auto bg-bb-sec">
        {isPicking && listCount === 0 || !isPicking && basketCount === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-lg border-4 border-dashed p-10 text-xl opacity-20">
              {isPicking ? "Your List is Empty" : "Your Basket is Empty"}
            </div>
          </div>
        ) : (
          isPicking ? 
            <BBList
              liveBasket={liveBasket}
              removeItem={handleRemoveItem}
              checkItem={handleItemCheck}
              reOrderItems={handleItemReorder}
            /> :
            <BagList basket={liveBasket} removeItem={handleRemoveItem} />
        )}
      </div>

      {isPicking && unpickedCount !== 0 || !isPicking && basketCount !== 0 ?
        <div className="bg-bb-off-l border-y-2 border-t-bb-sec border-b-bb-prim-l">
          <div className="flex px-2 py-1">
            <div className="flex-1">
              <span className="font-medium text-bb-prim p-1">
                {isPicking ? 
                  unpickedCount + " item(s) left" :
                  basketCount + " Items"
                }
              </span>
            </div>
            <div className="ml-auto">
              {isPicking ? null :
                <span className="font-medium p-1">
                  &#8369; { " " + baggedItemsTotalPrice.toFixed(2)}
                </span>}
            </div>
          </div>
        </div> : 
        null
      }

      <div className="bg-bb-prim flex flex-row gap-1 p-2">
          <div className="flex-1 grid grid-flow-col auto-cols-fr justify-center gap-1">
              {isPicking ? <>
                <BouncyButton
                      onClick={handleEmptyBasket}
                      type="texticon"
                      size="sm"
                >
                  <Trash2 className="flex-shrink-0 text-bb-red" />
                  <span className="text-xs font-medium text-bb-prim">
                    Empty List
                  </span>
                </BouncyButton>

                <BouncyButton
                  onClick={handleDonePicking}
                  type="texticon"
                  size="sm"
                  //key="done-picking-btn" //prevents the action leak on rerender issue, commented for accisdental animated side-effect
                >
                  <ShoppingCart className="flex-shrink-0 text-bb-green" />
                  <span className="text-xs font-medium text-bb-prim">
                    Done Picking
                  </span>
                </BouncyButton>
              </>: 
              <>
                <BouncyButton
                    onClick={handleEmptyBag}
                    type="texticon"
                    size="sm"
                  >
                    <ArchiveX className="flex-shrink-0 text-bb-red" />
                    <span className="text-xs font-medium text-bb-prim">
                      Empty Basket
                    </span>
                </BouncyButton>

                <BouncyButton
                  onClick={handlePickMore}
                  type="texticon"
                  size="sm"
                  //key="pick-more-btn" //prevents the action leak on rerender issue, commented for accisdental animated side-effect
                >
                  <ShoppingBasket className="flex-shrink-0 text-bb-green" />
                  <span className="text-xs font-medium text-bb-prim">
                    Pick More Items
                  </span>
                </BouncyButton>
              </>}
          </div>
          <div className="ml-auto">
            <BouncyButton size="ty" type="icononly">
              <Settings2 className="flex-shrink-0 text-gray-700" size={25} strokeWidth={1.5}/>
            </BouncyButton>
          </div>
      </div>

    </div>
  );
}
export default BBBasket;

/*
<BouncyButton
  onClick={handleRemoveUnpicked}
  type="texticon"
  size="sm"
>
  <Trash className="flex-shrink-0 text-bb-red" />
  <span className="text-xs font-medium text-bb-prim">
    Remove Unpicked
  </span>
</BouncyButton>
*/


/*return (
    <div className="flex h-full flex-col bg-amber-500">
      {isPicking ? (
        <>
          <div className="flex-grow-0 pt-4 px-2 bg-bb-prim">
            <BBItemSearch onAddAction={handleAddItem} onExploreAction={openRecordManagement} />
          </div>

          <div className="flex-grow-1 overflow-x-hidden overflow-y-auto bg-neutral-100 px-4">
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

          <div className="mt-auto flex justify-center gap-2 border-t-1 bg-bb-prim py-2">
            <BouncyButton
              onClick={handleEmptyBasket}
              type="texticon"
              size="sm"
            >
              <Trash2 className="flex-shrink-0 text-bb-red" />
              <span className="text-xs font-medium text-bb-prim">
                Empty Basket
              </span>
            </BouncyButton>

            <BouncyButton
              onClick={handleRemoveUnpicked}
              type="texticon"
              size="sm"
            >
              <Trash className="flex-shrink-0 text-bb-red" />
              <span className="text-xs font-medium text-bb-prim">
                Remove Unpicked
              </span>
            </BouncyButton>

            <BouncyButton
              onClick={handleDonePicking}
              type="texticon"
              size="sm"
            >
              <ShoppingCart className="flex-shrink-0 text-bb-green" />
              <span className="text-xs font-medium text-bb-prim">
                Done Picking
              </span>
            </BouncyButton>

            <BouncyButton size="ty" type="icononly">
              <Settings2 className="flex-shrink-0 text-gray-700" size={25} strokeWidth={1.5}/>
            </BouncyButton>
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
          <div className="mt-auto flex justify-center gap-2 border-t-1 bg-bb-prim py-2">
            <BouncyButton
              onClick={handleEmptyBag}
              type="texticon"
              size="sm"
            >
              <ArchiveX className="flex-shrink-0 text-bb-red" />
              <span className="text-xs font-medium text-bb-prim">
                Empty Bag
              </span>
            </BouncyButton>

            <BouncyButton
              onClick={handlePickMore}
              type="texticon"
              size="sm"
            >
              <ShoppingBasket className="flex-shrink-0 text-bb-green" />
              <span className="text-xs font-medium text-bb-prim">
                Pick More Items
              </span>
            </BouncyButton>

            <BouncyButton size="sm" type="icononly">
              <Settings2 className="flex-shrink-0 text-gray-700" size={45} strokeWidth={1.5}/>
            </BouncyButton>
          </div>
        </div>
      )}
    </div>
  );*/
