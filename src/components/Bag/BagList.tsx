import { BasketItem } from "../../data/models";
import { BASKET_ITEM_STATUS } from "../../services/bbddb";
import BBItem from "../BBList/BBItem";

function BagList({
  basket,
  removeItem,
}: {
  basket: BasketItem[];
  removeItem: (id: string) => void;
}) {
  return (
    <div
      className={
        "flex h-full w-full flex-col items-center overflow-y-auto px-1 py-8"
      }
    >
      <ul className="w-full">
        {basket.map((item: BasketItem) => {
          if (item.status === BASKET_ITEM_STATUS.BAGGED) {
            return (
              <BBItem
                key={item.id}
                data={item}
                onComplete={() => {}} //TODO: REFACTOR HACK
                onDelete={() => removeItem(item.id)} //TODO: REFACTOR HACK
                simpleMode={true}
              />
            );
          }
        })}
      </ul>
    </div>
  );
}

export default BagList;
