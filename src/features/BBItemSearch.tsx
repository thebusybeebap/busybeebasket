import { useState } from "react";

import useShop from "../hooks/useShop";
import useShopItem from "../hooks/useShopItem";

import { Shop, ShopItem } from "../data/models";
import BBAutocomplete from "../components/BBAutocomplete";
import ShopItemDetails from "../components/ShopItemDetails";

// changes on both here and autocomplete component
// in suggestions, display shop name and [price](no way to create/add right now)
// make it that it can be customized, can display any property

function BBItemSearch({
  onSearchDone
}:{
  onSearchDone: (searchedItem: ShopItem | undefined)=>void
}) {
  let [selectedShop, setSelectedShop] = useState<Shop>();
  let {fetchShopsByNameQuery, createShop, isShopLoading} = useShop();
  let [shopSearchValue, setShopSearchValue] = useState("");

  let [selectedItem, setSelectedItem] = useState<ShopItem>();
  let { fetchItemsInShopByNameQuery, fetchItemsInAllShopsByNameQuery, createShopItem, isShopItemLoading} = useShopItem();
  let [itemSearchValue, setItemSearchValue] = useState("");

  //SHOP
  function handleShopSelect(shop?: Shop) {
    if (shop) {
      setSelectedShop(shop);
      if(selectedItem){
        if(selectedItem.shopId !== shop.id){
          setSelectedItem(undefined);
          setItemSearchValue("");
        }
      }
    } else {
      setSelectedShop(undefined);
    }
  }

  async function handleCreateNewShop<Shop>(name: string){
    //TODO: add error handling
    let newShop = await createShop(name);

    setSelectedShop(newShop);
    setShopSearchValue(name);
    //new shop has no items yet
    setSelectedItem(undefined); //why does this not triger rerender for item input?
    setItemSearchValue(""); //why does this not triger rerender for item input?

    return newShop as Shop;
  }

  async function getShopSuggestions(searchQuery: string) {
    let shops: Shop[] = [];
    let hasExactMatch = false;
    try{
      ({shops, hasExactMatch} = await fetchShopsByNameQuery(searchQuery)); //is enclosing in () the best to do here?
    }
    catch(error){
      console.error("Failed to fetch Shops:", error);
    }
    finally{
      return({suggestionsResult: shops, hasExactMatch});
    }
  }

//TOCHECK is when selecting items, updating shop inpput accordingly, and vice versa
//FIXED: item input on create new, still showing suggestions

//FIXED: Creating New Shop doesn't update suggestions properly, removed autofocus back on input after selection
//WORKING: Create New Shop NOT clearing selected item even not in shop
//FIXED: Selecting a Shop, NOT clearing selected item even not in shop

  //ITEM
  function handleItemSelect(item?: ShopItem) {
    //TODO: to filter Shop selections when an item is selected, based if item is in Shop
    if (item) {
      setSelectedItem(item);
      onSearchDone(item);
      
      if(!selectedShop && item.shopName !== "NONE"){ // TODO REFACTOR "NONE" handling
        let shopFromSelectedItem = { //find better way of doing this
          id: item.shopId,
          name: item.shopName
        }
        setSelectedShop(shopFromSelectedItem);
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

  async function getItemsSuggestions(searchQuery: string) {
    let shopItems: ShopItem[] = []; // TODO: refactor useShopItems function to not return undefined
    let hasExactMatch = false;

    if(selectedShop){
      try{
        ({shopItems, hasExactMatch} = await fetchItemsInShopByNameQuery(selectedShop.id, searchQuery));
      }
      catch(error){
        console.error("Failed to fetch shop items:", error);
      }
    }
    else{
      try{
        ({shopItems, hasExactMatch} = await fetchItemsInAllShopsByNameQuery(searchQuery));
      }
      catch(error){
        console.error("Failed to fetch shop items:", error);
      }
    }
    return({suggestionsResult: shopItems, hasExactMatch});
  }

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
          placeHolder="Search Item"
          searchValue={itemSearchValue}
          updateSearchValue={setItemSearchValue}
          suggestionsDetails={(item)=>ShopItemDetails(item, !selectedShop)}
        />
      </div>
    </div>
  );
}

export default BBItemSearch;
