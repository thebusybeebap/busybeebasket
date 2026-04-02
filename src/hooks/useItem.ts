import { useState } from "react";
import { PersistItems } from "../services/Items";

function useItem(){
  let [isItemLoading, setIsItemLoading] = useState(false);

  async function fetchItemById(id: string) {
    setIsItemLoading(true);
    let result = await PersistItems.getItemById(id);
    setIsItemLoading(false);
    return result;
  }

  async function deleteItem(id: string){
    let result = await PersistItems.deleteItem(id);
    return result;
  }

  async function renameItem(itemId: string, newName: string){
    newName = newName.trim();
    let result = await PersistItems.renameItem(itemId, newName);
    return result;
  }

  return { fetchItemById, deleteItem, renameItem, isItemLoading};
}

export default useItem;