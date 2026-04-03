import { useRef, useState } from "react";
import BouncyButton from "../components/ui/BouncyButton";
import BBItemSearch from "../features/BBItemSearch";
import { Shop, ShopItem } from "../data/models";
import { Ban, Save, SquarePen, SquareX, Trash2 } from "lucide-react";
import useShopItem from "../hooks/useShopItem";
import useShop from "../hooks/useShop";
import useItem from "../hooks/useItem";

function Repository(){

  let recordNameInputRef = useRef<HTMLInputElement>(null);
  let [isRecordItem, setIsRecordItem] = useState(true);
  let [isEditName, setIsEditName] = useState(false);

  let [recordId, setRecordId] = useState(""); //needed for edit and delete functions?
  let [recordName, setRecordName] = useState("");
  let [recordSublist, setRecordSublist] = useState<ShopItem[]>([]);
  let [selectedSublistRowId, setSelectedSublistRowId] = useState("");

  let {fetchShopsByItemId, fetchItemsByShopId, removeItemFromShop} = useShopItem();
  let {deleteShop, renameShop} = useShop();
  let {deleteItem, renameItem} = useItem();

  function clearRecord(){
    setRecordId("");
    setRecordName("");
    setRecordSublist([]);
    setSelectedSublistRowId("");
  }

  function handleShopSelect(selectedShop: Shop|undefined){
    //TODO: Creating enw shop does not trigger shwoing of record
    setIsRecordItem(false);
    if(selectedShop){
      setRecordId(selectedShop.id);
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
      setRecordId(selectedItem.itemId);
      setRecordName(selectedItem.name);
      fetchShopsByItemId(selectedItem.itemId).then((shops)=>setRecordSublist(shops));
    }
    else{
      clearRecord();
    }
  }

  function handleSelectSublistRow(id: string){
    setSelectedSublistRowId(id);
  }

  function handleDeleteItem(itemId: string){//removed from all shops, PersistItem and PersistShopItem
    deleteItem(itemId);
    clearRecord();
  }

  function handleDeleteShop(shopId: string){//removed from PersistShop with all PersistShopItems with shop
    deleteShop(shopId);
    clearRecord();
  }

  function handleRemoveItemFromShop(id: string, itemId: string, shopId: string){
    removeItemFromShop(itemId, shopId);
    setRecordSublist((sublist)=>sublist.filter((row)=> row.id !== id ? row : null));
  }

  function handleEditClick(){
    setIsEditName(true);
  }
  
  function handleCancelEdit(){
    setIsEditName(false);
  }

  function handleRenameItem(){
    let newName = recordNameInputRef.current?.value.trim() ?? "";
    if(newName === ""){
      setIsEditName(false);
      return;
    }
    if(newName === recordName){
      setIsEditName(false);
      return;
    }

    renameItem(recordId, newName)
      .then(()=>{
        setRecordName(newName);
      }).finally(()=>{
        setIsEditName(false);
      });
  }

  function handleRenameShop(){
    let newName = recordNameInputRef.current?.value.trim() ?? "";
    if(newName === ""){
      setIsEditName(false);
      return;
    }
    if(newName === recordName){
      setIsEditName(false);
      return;
    }

    renameShop(recordId, newName)
      .then(()=>{
        setRecordName(newName);
      }).finally(()=>{
        setIsEditName(false);
      });
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
          <div className="bg-bb-base border-bb-off border-4 px-2 py-1">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              {isEditName?
                <>
                  <input
                    ref={recordNameInputRef}
                    className="text-2xl font-bold text-bb-prim wrap-anywhere outline-1 box-border px-2 rounded-md focus:ring-2 focus:ring-bb-sec focus:outline-none"
                    type="text"
                    autoFocus
                    defaultValue={recordName}
                  />
                  <div className="flex gap-1">
                    <Save size={30}
                      onClick={isRecordItem ? ()=>handleRenameItem() : ()=>handleRenameShop()}
                      className="cursor-pointer rounded-lg text-bb-green opacity-50 transition-all hover:bg-gray-200 hover:opacity-100 active:scale-90 active:opacity-50"
                    />
                    <Ban size={30}
                      onClick={handleCancelEdit}
                      className="cursor-pointer rounded-lg text-bb-red opacity-50 transition-all hover:bg-gray-200 hover:opacity-100 active:scale-90 active:opacity-50"
                    />
                  </div>
                </>:
                <>
                  <span className="text-2xl font-bold text-bb-prim wrap-anywhere">{recordName}</span>
                  <span 
                    onClick={handleEditClick} 
                    className="text-bb-prim-l cursor-pointer"
                  >
                      <SquarePen className="hover:bg-gray-200"/>
                  </span>
                </>
              }
            </div>
            <div></div>
          </div>
          <div className="bg-bb-base border-bb-off border-4 overflow-x-hidden overflow-y-auto px-2">
            <ul>
              <li className="grid grid-cols-[6fr_2fr_1fr] gap-2 pt-2 font-bold border-b-2 border-bb-off-l">
                <div>{isRecordItem ? "Item" : "Shop"}</div>
                <div className="ml-auto">Price</div>
              </li>
              {recordSublist.map((row)=>(
                <li key={row.id}
                    className={"grid grid-cols-[6fr_2fr_1fr] gap-2 pt-4 " +
                      (selectedSublistRowId === row.id ? "font-bold" : "hover:font-bold")
                    }
                    onClick={()=>handleSelectSublistRow(row.id)}
                >
                  <div className="wrap-anywhere">{isRecordItem ? row.shopName : row.name}</div>
                  <div className="ml-auto">{row.price}</div>
                  <div 
                    className="ml-auto cursor-pointer hover:text-bb-red-l"
                    onClick={()=>handleRemoveItemFromShop(row.id, row.itemId, row.shopId)}>
                    <SquareX 
                      className={selectedSublistRowId === row.id ? 
                        "text-bb-red-l" : "text-bb-prim-l hover:text-bb-red-l"} 
                    />
                  </div>
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
        <BouncyButton 
          type="texticon"
          onClick={isRecordItem ? ()=>handleDeleteItem(recordId) : ()=>handleDeleteShop(recordId)}
        >
          <Trash2 className={"flex-shrink-0 " + (recordName === "" ? "text-bb-prim-l" : "text-bb-red-l")}/>
          <span className="text-xs font-medium text-bb-prim-l">
            {"Delete " + (isRecordItem ? "Item" : "Shop")} 
          </span>
        </BouncyButton>
      </div>
    </div>
  );
}

export default Repository;