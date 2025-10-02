import {
  closestCorners,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { BasketItem } from "../../data/models";
import BBItem from "./BBItem";

function BBList({
  basket,
  removeItem,
  checkItem,
  moveItem,
}: {
  basket: BasketItem[];
  removeItem: (id: string) => void;
  checkItem: (id: string) => void;
  moveItem: (oldIndex: number, newIndex: number) => void;
}) {
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
      moveItem(oldIndex, newIndex);
    }
  }

  return (
    <div
      className={
        "flex h-full w-full flex-col items-center overflow-y-auto px-2 py-8"
      }
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={(event) => handleDragEnd({ event })}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext
          items={basket.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="w-full">
            {basket.map((item: BasketItem) =>
              item.isCompleted ? null : (
                <BBItem
                  key={item.id}
                  data={item}
                  onComplete={() => handleTaskComplete(item.id)}
                  onDelete={() => handleTaskDelete(item.id)}
                />
              ),
            )}
          </ul>
        </SortableContext>
      </DndContext>
      <ul className="w-full">
        {basket.map((item: BasketItem) =>
          item.isCompleted ? (
            <BBItem
              key={item.id}
              data={item}
              onComplete={() => handleTaskComplete(item.id)}
              onDelete={() => handleTaskDelete(item.id)}
            />
          ) : null,
        )}
      </ul>
      <div>
        filter items instead of a new one. Completed(can be uncompleted),
        unsortable, deletable, action button
      </div>
    </div>
  );
}

export default BBList;
