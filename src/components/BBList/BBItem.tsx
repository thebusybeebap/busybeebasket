import { useSortable } from "@dnd-kit/sortable";
import {
  Ban,
  GripVertical,
  Save,
  Square,
  SquareCheck,
  SquarePen,
  SquareX,
} from "lucide-react";
import { BasketItem } from "../../data/models";
import { BASKET_ITEM_STATUS } from "../../services/bbddb";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useState } from "react";
import { PersistShopItems } from "../../services/ShopItems";
import { PersistBasketItems } from "../../services/BasketItems";

//TODO: DONE FIX:FIXED DRAGGING UI

export type BBItemParams = {
  data: BasketItem;
  onComplete: () => void;
  onDelete: () => void;
  simpleMode?: boolean;
};

function BBItem({
  data,
  onComplete,
  onDelete,
  simpleMode = false,
}: BBItemParams) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: data.id });

  let [isEditingPrice, setIsEditingPrice] = useState(false);
  let priceInputRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  function handleSavePriceEdit() {
    if (priceInputRef.current) {
      let newPrice = parseFloat(priceInputRef.current.value);
      if (!isNaN(newPrice) && newPrice >= 0) {
        PersistShopItems.updateShopItemPrice(
          data.itemId,
          data.shopId,
          newPrice,
        );
        //PersistBasketItems.updateBasketItemPrice(data.id, newPrice);
        PersistBasketItems.updateSameBasketItemPrices(
          data.shopId,
          data.itemId,
          newPrice,
        );
        //TODO: TO REFACTOR, Don't call Persist functions here
        //TODO: Better Price formatting as well when reaching high values(over 4 digits)
      }
    }
    setIsEditingPrice(false);
  }

  function handleCancelPriceEdit() {
    setIsEditingPrice(false);
  }

  function handlePriceEdit() {
    setIsEditingPrice(true);
  }

  return (
    <li
      className={
        "group flex bg-neutral-100 py-2 wrap-anywhere sm:border-y-1 " +
        (isDragging ? " relative z-50 bg-neutral-100 shadow-xl/30" : "")
      }
      style={style}
      ref={setNodeRef}
      {...attributes}
    >
      {simpleMode ? (
        <div className="grow-1 px-2 py-1">
          <div className="h-full w-full cursor-text flex-col items-center gap-2 wrap-anywhere">
            <div className="w-full flex-1 border-b-1">
              <span className="text-lg font-medium">{data.name}</span>
            </div>

            <div className="flex w-full flex-1 gap-4 pt-2">
              <div className="flex flex-1 gap-1">
                <label className="shrink-0 font-medium text-neutral-500">
                  Shop:{" "}
                </label>
                <span>{data.shopName}</span>
              </div>
              <div className="flex flex-1 gap-1">
                <div className="flex shrink-0">
                  {isEditingPrice ? (
                    <>
                      <Save
                        onClick={handleSavePriceEdit}
                        className="cursor-pointer rounded-lg text-green-700 opacity-50 transition-all hover:bg-gray-200 hover:opacity-100 active:scale-90 active:opacity-50"
                      />
                      <Ban
                        onClick={handleCancelPriceEdit}
                        className="cursor-pointer rounded-lg text-red-700 opacity-50 transition-all hover:bg-gray-200 hover:opacity-100 active:scale-90 active:opacity-50"
                      />
                    </>
                  ) : (
                    <>
                      <SquarePen
                        onClick={handlePriceEdit}
                        className="cursor-pointer rounded-lg text-gray-700 opacity-50 transition-all hover:bg-gray-200 hover:opacity-100 active:scale-90 active:opacity-50"
                      />

                      <label className="shrink-0 font-medium text-neutral-500">
                        Price:{" "}
                      </label>
                    </>
                  )}
                </div>
                <div className="grow-0">
                  {isEditingPrice ? (
                    <input
                      ref={priceInputRef}
                      autoFocus
                      step="0.01"
                      min="0"
                      className="w-full rounded-md border pl-1 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                      type="number"
                      defaultValue={data.price}
                    />
                  ) : (
                    <span className="grow-0">
                      &#8369;
                      {data.price?.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {" "}
          <div
            className={
              "grow-0 py-1 hover:cursor-move " +
              (data.status === BASKET_ITEM_STATUS.PICKED
                ? " opacity-0"
                : " opacity-70 hover:opacity-100")
            }
            ref={setActivatorNodeRef}
            {...listeners}
          >
            <GripVertical />
          </div>
          <div className="grow-0 py-1 pr-1 pl-2 opacity-70 hover:opacity-100">
            {data.status === BASKET_ITEM_STATUS.PICKED ? (
              <SquareCheck
                onClick={() => onComplete()}
                className="cursor-pointer rounded-lg text-gray-700 opacity-50 transition-all hover:bg-gray-200 hover:opacity-100 active:scale-90 active:opacity-70"
              />
            ) : (
              <Square
                onClick={() => onComplete()}
                className="cursor-pointer rounded-lg text-gray-700 transition-all hover:bg-gray-200 hover:opacity-100 active:scale-90 active:opacity-70"
              />
            )}
          </div>
          <div
            className={
              "grow-1 px-2 py-1" +
              (data.status === BASKET_ITEM_STATUS.PICKED
                ? " line-through opacity-50"
                : "")
            }
          >
            {
              <div className="h-full w-full cursor-text flex-col items-center gap-2 wrap-anywhere">
                <div className="w-full flex-1 border-b-1">
                  <span className="text-lg font-medium">{data.name}</span>
                </div>

                <div className="flex w-full flex-1 gap-1 pt-2">
                  <div className="flex flex-1 gap-1">
                    <label className="shrink-0 font-medium text-neutral-500">
                      Shop:{" "}
                    </label>
                    <span>{data.shopName}</span>
                  </div>
                  <div className="flex flex-1 gap-1">
                    <div className="flex shrink-0">
                      <label className="shrink-0 font-medium text-neutral-500">
                        Price:{" "}
                      </label>
                    </div>
                    <span>
                      &#8369;
                      {data.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
        </>
      )}

      <div className="grow-0 px-1 py-1">
        <button
          className="cursor-pointer rounded-lg text-gray-700 opacity-50 transition-all hover:bg-gray-200 hover:opacity-100 active:scale-90 active:opacity-50"
          aria-label="Delete Item"
          onClick={() => onDelete()}
        >
          <SquareX />
        </button>
      </div>
    </li>
  );
}

export default BBItem;
