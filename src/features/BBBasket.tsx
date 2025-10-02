import { generateId, ShopItem } from "../data/models";
import BBItemSearch from "./BBItemSearch";
import useBBList from "../components/BBList/useBBList";
import BBList from "../components/BBList/BBList";

function BBBasket() {
  let { basket, addItem, removeItem, checkItem, fillBasket, moveItem } =
    useBBList(); //TODO: rename/refactor to useBasket

  function handleAddItemToBasket(itemToAdd: ShopItem) {
    if (itemToAdd) {
      let itemBasketId = generateId();
      addItem({ ...itemToAdd, id: itemBasketId, isCompleted: false });
    }
  }

  return (
    <div className="flex h-full flex-col bg-green-900">
      <div className="h-4 bg-green-400"></div>

      <div className="flex-grow-0">
        <BBItemSearch onAddAction={handleAddItemToBasket} />
      </div>

      <div className="flex-grow-1 overflow-x-hidden overflow-y-auto bg-teal-300">
        <BBList
          basket={basket}
          removeItem={removeItem}
          checkItem={checkItem}
          moveItem={moveItem}
        />
      </div>

      <div className="mt-auto bg-orange-600">
        <ul>
          <li>
            Component - non-draggable, readonly, deletable, with action
            button(add/update price, add/update barcode)
          </li>
        </ul>
      </div>
    </div>
  );
}
export default BBBasket;

/*

        Scrollable area, items are draggable in y axis, fixed height overflow
        scroll, Items - Completable, handle draggable, deletable, action
        button(add/update price/barcode)
        <ul>
          {basket.map((item) => {
            return <li key={item.id}>{item.name}</li>;
          })}
        </ul>
        <ul className="flex px-1 py-2">
          {basket.map((item) => {
            return (
              <li className="line-through" key={item.id}>
                {item.name}
              </li>
            );
          })}
        </ul>
*/
