import { useState } from "react";
import { PersistItems } from "../services/Items";

function useShop(){
  let [isItemLoading, setIsItemLoading] = useState(false);

  async function fetchItemById(id: string) {
    setIsItemLoading(true);
    let result = await PersistItems.getItemById(id);
    setIsItemLoading(false);
    return result;
  }

  return { fetchItemById, isItemLoading};
}

export default useShop;