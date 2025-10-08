import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { BasketItem } from "../../data/models";
import BBItem from "./BBItem";
import { BASKET_ITEM_STATUS } from "../../services/bbddb";
import { useEffect, useState } from "react";

function BBList({
  liveBasket,
  removeItem,
  checkItem,
  reOrderItems,
}: {
  liveBasket: BasketItem[];
  removeItem: (id: string) => void;
  checkItem: (id: string) => void;
  reOrderItems: (reOrderedItems: BasketItem[]) => void;
}) {
  let [basket, setBasket] = useState([] as BasketItem[]);
  let sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleTaskDelete(id: string) {
    removeItem(id);
  }

  function handleTaskComplete(id: string) {
    checkItem(id);
  }

  function handleDragEnd({ event }: { event: DragEndEvent }) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = basket.findIndex(
        (item: BasketItem) => item.id === active.id,
      );
      const newIndex = basket.findIndex(
        (item: BasketItem) => item.id === over?.id,
      );
      setBasket((prevBasket) => {
        let reOrderedItems = arrayMove(prevBasket, oldIndex, newIndex);
        reOrderItems(reOrderedItems);
        return reOrderedItems;
      });
    }
  }

  useEffect(() => {
    setBasket(liveBasket);
  }, [liveBasket]);

  return (
    <div
      className={
        "flex h-full w-full flex-col items-center overflow-y-auto px-1 py-8"
      }
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd({ event })}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext
          items={basket.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="w-full">
            {basket.map((item: BasketItem) =>
              item.status === BASKET_ITEM_STATUS.UNPICKED ? (
                <BBItem
                  key={item.id}
                  data={item}
                  onComplete={() => handleTaskComplete(item.id)}
                  onDelete={() => handleTaskDelete(item.id)}
                />
              ) : null,
            )}
          </ul>
        </SortableContext>
      </DndContext>
      <ul className="w-full">
        {basket.map((item: BasketItem) =>
          item.status === BASKET_ITEM_STATUS.PICKED ? (
            <BBItem
              key={item.id}
              data={item}
              onComplete={() => handleTaskComplete(item.id)}
              onDelete={() => handleTaskDelete(item.id)}
            />
          ) : null,
        )}
      </ul>
    </div>
  );
}

export default BBList;
