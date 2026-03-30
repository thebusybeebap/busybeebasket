import { useState } from "react";
import BouncyButton from "../components/ui/BouncyButton";
import BBItemSearch from "../features/BBItemSearch";
import { Shop, Item } from "../data/models";
import { CircleX } from "lucide-react";

function Repository(){

  //TODO: show only delete button if ROW of show OR item IS SELECTED

  let [displayedRecord, setDisplayedRecord] = useState("");

  function handleShopSelect(selectedShop: Shop|undefined){
    if(selectedShop){
      setDisplayedRecord(selectedShop.name);
    }
  }

  function handleItemSelect(selectedItem: Item|undefined){
    if(selectedItem){
      setDisplayedRecord(selectedItem.name);
    }
  }

  return(
    <div className="h-full grid grid-rows-[auto_1fr_auto]">
      <div className="bg-bb-prim">
        <BBItemSearch 
          onSelectShopAction={handleShopSelect}
          onSelectItemAction={handleItemSelect}
          buttonMode={false}
          />
      </div>

      <div className="bg-bb-sec h-full grid grid-rows-[auto_1fr] p-2 gap-1">
      {displayedRecord ?
        <>
          <div className="bg-bb-base px-2 py-1">
            <div className="text-2xl text-bb-prim">{displayedRecord}</div>
            <div></div>
          </div>
          <div className="bg-bb-base overflow-x-hidden overflow-y-auto px-2">
            <ul>
              <li className="grid grid-cols-[6fr_2fr_1fr] gap-2">
                <div>Shop</div>
                <div className="ml-auto">Price</div>
              </li>

              <li className="grid grid-cols-[6fr_2fr_1fr] gap-2">
                <div>[shop name]</div>
                <div className="ml-auto">[item price in shop]</div>
                <div className="ml-auto"><CircleX className="text-bb-red" /></div>
              </li>
            </ul>
          </div>
        </> :
        <>
          <div></div>
          <div className="flex h-full items-center justify-center">
            <div className="rounded-lg border-4 border-dashed p-10 text-xl opacity-20">
              {"Search an Item or Shop"}
            </div>
          </div>
        </>
      }
      </div>
      

      <div className="bg-bb-prim flex flex-row gap-1 p-2">
        <BouncyButton>Delete</BouncyButton> <BouncyButton>Clear</BouncyButton>
      </div>
    </div>
  );
}

export default Repository;