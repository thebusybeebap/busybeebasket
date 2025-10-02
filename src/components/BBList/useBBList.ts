//TODO: Add Dexie calls to sync with local storage

import { useState } from "react";
import { BasketItem } from "../../data/models";
import { arrayMove } from "@dnd-kit/sortable";

function useBBList() {
  let [basket, setBasket] = useState([] as BasketItem[]);

  function addItem(item: BasketItem) {
    setBasket((prevBasket) => [item, ...prevBasket]);
  }

  function removeItem(id: string) {
    setBasket((prevBasket) => prevBasket.filter((item) => item.id !== id));
  }

  function checkItem(id: string) {
    setBasket((prevBasket) =>
      prevBasket.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item,
      ),
    );
  }

  function fillBasket(shelvedItems: BasketItem[]) {
    return setBasket;
  }

  function moveItem(oldIndex: number, newIndex: number) {
    //TODO: Refactor decouple arrayMove from setState
    setBasket((prevBasket) => arrayMove(prevBasket, oldIndex, newIndex));
  }

  return { basket, addItem, removeItem, checkItem, fillBasket, moveItem };
}

export default useBBList;
