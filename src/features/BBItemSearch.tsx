import { useState } from "react";

import useShop from "../hooks/useShop";
import useShopItem from "../hooks/useShopItem";

import { Shop, ShopItem } from "../data/models";
import BBAutocomplete from "../components/BBAutocomplete";

import { FilterStrategies } from "../utils/FilterStrategies";

function BBItemSearch({
  onSearchDone
}:{
  onSearchDone: (searchedItem: ShopItem | undefined)=>void
}) {
  let [selectedShop, setSelectedShop] = useState<Shop>();
  let {fetchShopsWithFilter, createShop, isShopLoading} = useShop();
  let [shopSearchValue, setShopSearchValue] = useState("");

  let [selectedItem, setSelectedItem] = useState<ShopItem>();
  let {fetchItemsInShopByName, fetchItemsInAllShopsByName, createShopItem, isShopItemLoading} = useShopItem();
  let [itemSearchValue, setItemSearchValue] = useState("");

  //SHOP
  function handleShopSelect(shop?: Shop) {
    if (shop) {
      setSelectedShop(shop);
    } else {
      setSelectedShop(undefined);
    }
  }

  async function handleCreateNewShop<Shop>(name: string){
    let newShop;
    
    try{
      newShop = await createShop(name);
    }
    catch(error){
      console.error("Failed to create new shop:", error);
    }

    setSelectedShop(newShop);

    return newShop as Shop;
  }

  async function getShopSuggestions(searchQuery: string) {
    let shops: Shop[] = [];
    try{
       shops = await fetchShopsWithFilter(searchQuery, FilterStrategies.filterByName); 
    }
    catch(error){
      console.error("Failed to fetch Shops:", error);
    }
    return shops as Shop[];
  }

  //ITEM
  function handleItemSelect(item?: ShopItem) {
    //TODO: to filter Shop selections when an item is selected, based if item is in Shop
    if (item) {
      setSelectedItem(item);
      onSearchDone(item);
      
      if(!selectedShop && item.shopName !== "none"){
        let shopFromSelectedItem = { //find better way of doing this
          id: item.shopId,
          name: item.shopName
        }
        setSelectedShop(shopFromSelectedItem); // !!! ONLY updates the selectedShop state here but not the 
        setShopSearchValue(shopFromSelectedItem.name); // do this for shop select also, clear item if item is not in selected shop
        // search value on autocomplete component
      }
    } else {
      setSelectedItem(undefined); //when does this happen?? when is the selectedItem state cleared? check
      onSearchDone(undefined);
    }
  }

  async function handleCreateNewItem<ShopItem>(name: string) {
    
    let newShopItem;
    
    let shopId = selectedShop?.id;
    try{
      newShopItem = await createShopItem({shopId: shopId, newItemName: name});
    }
    catch(error){
      console.error("Failed to Create New Shop Item:", error);
    }
        
    setSelectedItem(newShopItem);
    onSearchDone(newShopItem);
    return newShopItem as ShopItem;
  }

  function isItemInShop(item: ShopItem): boolean {
    if(selectedShop){
      return(item.shopId === selectedShop.id);
    }
    else{
      return(item.shopName === "none");
    }
  }

  async function getItemsSuggestions(searchQuery: string) {
    let shopItems: ShopItem[] | undefined = []; // TODO: refactor useShopItems function to not return undefined
    let hasExactMatch = false;

    if(selectedShop){
      try{
        ({shopItems, hasExactMatch} = await fetchItemsInShopByName(selectedShop.id, searchQuery));
      }
      catch(error){
        console.error("Failed to fetch shop items:", error);
      }
    }
    else{
      try{
        ({shopItems, hasExactMatch} = await fetchItemsInAllShopsByName(searchQuery));
      }
      catch(error){
        console.error("Failed to fetch shop items:", error);
      }
    }
      
    return shopItems ?? []; //TO UPDATE
  }
 // showNew setup TOO for Shops, still showing new item option even exact match
  return (
    <div>
      <div>
        <BBAutocomplete<Shop>
          suggestionsFunction={getShopSuggestions}
          selected={selectedShop}
          onSelect={handleShopSelect}
          onCreateNew={handleCreateNewShop}
          placeHolder="Search Shop"
          searchValue={shopSearchValue}
          updateSearchValue={setShopSearchValue}
        />
      </div>
      <div>
        <BBAutocomplete<ShopItem>
          suggestionsFunction={getItemsSuggestions}
          selected={selectedItem}
          onSelect={handleItemSelect}
          onCreateNew={handleCreateNewItem}
          showNew={isItemInShop}
          placeHolder="Search Item"
          searchValue={itemSearchValue}
          updateSearchValue={setItemSearchValue}
        />
      </div>
    </div>
  );
}

export default BBItemSearch;
