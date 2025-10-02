import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Square, SquareCheck, X } from "lucide-react";
import { BasketItem } from "../../data/models";

export type BBItemParams = {
  data: BasketItem;
  onComplete: () => void;
  onDelete: () => void;
};

function BBItem({ data, onComplete, onDelete }: BBItemParams) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: data.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li
      className={
        "group flex px-1 py-2 wrap-anywhere sm:border-y-1 " +
        (isDragging ? " bg-red-500" : "")
      }
      style={style}
      ref={setNodeRef}
      {...attributes}
    >
      <div
        className={
          "grow-0 hover:cursor-move" +
          (data.isCompleted ? " opacity-0" : " opacity-70 hover:opacity-100")
        }
        ref={setActivatorNodeRef}
        {...listeners}
      >
        <GripVertical />
      </div>

      <div className="grow-0 pr-1 pl-4 opacity-70 hover:opacity-100">
        {data.isCompleted ? (
          <SquareCheck
            onClick={() => onComplete()}
            className="opacity-50 hover:cursor-pointer"
          />
        ) : (
          <Square
            onClick={() => onComplete()}
            className="active hover:cursor-pointer"
          />
        )}
      </div>

      <div
        className={
          "grow-1 px-2" + (data.isCompleted ? " line-through opacity-50" : "")
        }
      >
        {
          <div className="h-full w-full cursor-text wrap-anywhere">
            {data.name}
          </div>
        }
      </div>

      <div className="grow-0 px-1">
        <button
          className={
            isDragging
              ? ""
              : "rounded-full group-hover:opacity-100 group-active:opacity-100" +
                "bg-red-500"
          }
          aria-label="Delete Item"
          onClick={() => onDelete()}
        >
          <X />
        </button>
      </div>
    </li>
  );
}

export default BBItem;
