import { useState } from "react";
import BouncyButton from "../components/ui/BouncyButton";
import BBItemSearch from "../features/BBItemSearch";
import { Shop, Item, ShopItem } from "../data/models";
import { SquarePen, SquareX } from "lucide-react";
import useShopItem from "../hooks/useShopItem";

function Repository(){

  //TODO: show only delete button if ROW of show OR item IS SELECTED

  let [isRecordItem, setIsRecordItem] = useState(true);

  //let [recordId, setRecordId] = useState(""); //needed for edit and delete functions?
  let [recordName, setRecordName] = useState("");
  let [recordSublist, setRecordSublist] = useState<ShopItem[]>([]);

  let {fetchShopsByItemId, fetchItemsByShopId} = useShopItem();

  function clearRecord(){
    setRecordName("");
    setRecordSublist([]);
  }

  function handleShopSelect(selectedShop: Shop|undefined){
    setIsRecordItem(false);
    if(selectedShop){
      setRecordName(selectedShop.name);
      fetchItemsByShopId(selectedShop.id).then((items)=>setRecordSublist(items));
    }
    else{
      clearRecord();
    }
  }

  function handleItemSelect(selectedItem: ShopItem|undefined){
    setIsRecordItem(true);
    if(selectedItem){
      setRecordName(selectedItem.name);
      fetchShopsByItemId(selectedItem.itemId).then((shops)=>setRecordSublist(shops));
    }
    else{
      clearRecord();
    }
  }

  function handleRemoveItemFromShop(){

  }

  function handleDeleteItem(){//removed from all shops, PersistItem and PersistShopItem

  }

  function handleDeleteShop(){//removed from PersistShop with all PersistShopItems with shop

  }

  function handleRenameItem(){

  }

  function handleRenameShop(){
    //don't allow edit on NONE
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
      {recordName ?
        <>
          <div className="bg-bb-base px-2 py-1">
            <div className="grid grid-cols-[1fr_auto]">
              <span className="text-2xl text-bb-prim">{recordName}</span>
              <span className="text-bb-prim-l"><SquarePen /></span>
            </div>
            <div></div>
          </div>
          <div className="bg-bb-base overflow-x-hidden overflow-y-auto px-2">
            <ul>
              <li className="grid grid-cols-[6fr_2fr_1fr] gap-2">
                <div>Shop</div>
                <div className="ml-auto">Price</div>
              </li>
              {recordSublist.map((record)=>(
                <li key={record.id}
                    className="grid grid-cols-[6fr_2fr_1fr] gap-2"
                >
                  <div>{isRecordItem ? record.shopName : record.name}</div>
                  <div className="ml-auto">{record.price}</div>
                  <div className="ml-auto" onClick={()=>handleRemoveItemFromShop()}><SquareX className="text-bb-red" /></div>
                </li>
              ))}
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
        <BouncyButton>Delete</BouncyButton>
      </div>
    </div>
  );
}

export default Repository;