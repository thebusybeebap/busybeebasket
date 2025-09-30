import { useState } from "react";
import { BasketItem, ShopItem } from "../data/models";
import BBItemSearch from "./BBItemSearch";

function BBBasket() {
  let [basketItems, setBasketItem] = useState<BasketItem[]>([]);

  function handleAddItemToBasket(itemToAdd: ShopItem) {
    if (itemToAdd) {
      //generate new Id for this, should be allowed to put multiple instances of the item
      setBasketItem((prevBasketItems) => [...prevBasketItems, itemToAdd]);
    }
  }

  return (
    <div className="flex h-full flex-col bg-green-900">
      <div className="h-4 bg-green-400"></div>

      <div className="flex-grow-0">
        <BBItemSearch onAddAction={handleAddItemToBasket} />
      </div>

      <div className="flex-grow-1 overflow-x-hidden overflow-y-auto bg-teal-300">
        Scrollable area, items are draggable in y axis, fixed height overflow
        scroll
        <ul>
          {basketItems.map((item) => {
            return <li key={item.id}>{item.name}</li>;
          })}
        </ul>
        <ul className="flex px-1 py-2">
          {basketItems.map((item) => {
            return (
              <li className="line-through" key={item.id}>
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto bg-orange-600">
        Expand Bought Section should stick to bottom
      </div>
    </div>
  );
}
export default BBBasket;
