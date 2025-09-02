import { useState } from "react";
import BBAutocomplete from "../ui/BBAutocomplete";
import dummyDataAPI, { Store, StoreItem } from "../utils/data";
import { generateNewItemId, generateNewStoreId } from "../utils/idGenerator";

//data query related to items search should be done at this level/component not higher, basket level does not need the data]
//SEARCH SUGGESTIONS TO BE CHANGED TO FETCH REALTIME FROM CACHE/OFFLINESTORAGE/ONLINE
//DUMMY DB DATA
let { getStoreItems, getStores } = dummyDataAPI();
let storesDBdummy = getStores(); // TODO: limit max 10 rows fetch in actual query
let itemsDBdummy = getStoreItems(); // TODO: limit max 10 rows fetch in actual query
//DUMMY DB DATA

function BBItemSearch() {
  //STORES STATE
  let [storeList, setStoreList] = useState(storesDBdummy);
  let [selectedStore, setSelectedStore] = useState<Store>();

  //ITEMS STATE
  let [shelfItems, setShelfItems] = useState(itemsDBdummy);
  //filteredItems; // is this really needed? maybe just filter on the go
  let [selectedItem, setSelectedItem] = useState<StoreItem>();
  let filteredItems = shelfItems; //does this need to be state?

  //STORES SEARCH SELECT
  function handleStoreSelect(store?: Store) {
    if (store) {
      setSelectedStore(store);
      filteredItems = shelfItems.filter((item) => item.storeId === store.id);
    } else {
      //setSelectedStore(undefined); is this needed check what heppens if search cleared or emptied
      filteredItems = shelfItems;
    }
  }

  //STORES SEARCH ADD
  function handleCreateNewStore(name: string): Store {
    let newID = generateNewStoreId();
    let newStore = { id: newID, name: name };
    // DB query add new Store, don't update state on fail
    setStoreList([...storeList, newStore]);
    return newStore;
  }

  //STORES SEARCH FILTER
  function handleStoreSearch(searchValue: string): Store[] {
    //onSearch to replace _filterSuggestions in BBAutocomplete component
    //provides more control on how to filter search

    return [];
  }

  //ITEMS SEARCH SELECT
  function handleItemSelect(item?: StoreItem) {
    //not filtering stores based on item selected yet
    if (item) {
      setSelectedItem(item);
    } else {
      //setSelectedItem(undefined); // TOCHECK like in store
    }
  }

  //ITEMS SEARCH ADD
  function handleCreateNewItem(name: string) {
    let newID = generateNewItemId();
    let storeId = selectedStore?.id ?? undefined;
    let storeName = selectedStore?.name ?? undefined;
    let newItem = {
      id: newID + (storeId ?? ""),
      itemId: newID,
      name: name,
      storeId: storeId,
      storeName: storeName,
    };
    // DB query add new Item, don't update state on fail
    setShelfItems([...shelfItems, newItem]);
    return newItem;
  }

  //ITEMS SEARCH FILTER
  function handleItemSearch(searchValue: string): Store[] {
    return [];
  }

  //ADD TO BASKET
  function handleAddToBasket() {
    //currently selected item add to list
    //Add Item Button - has onClick prop, accept the function that adds the selected item on the basket
  }

  function handleAddByQR() {
    // search item match for QR code, then fill selectedItem with details, (could add checkbox for auto add in list if a store is selected)
  }

  return (
    <div>
      <div>
        <BBAutocomplete<Store>
          suggestionsDataSource={storeList}
          selected={selectedStore}
          onSelect={handleStoreSelect}
          onCreateNew={handleCreateNewStore}
          placeHolder="Search Store"
        />
      </div>
      <div>
        <BBAutocomplete<StoreItem>
          suggestionsDataSource={filteredItems}
          selected={selectedItem}
          onSelect={handleItemSelect}
          onCreateNew={handleCreateNewItem}
          showCreateOptionAlways={selectedStore === undefined}
          placeHolder="Search Item"
        />

        <button onClick={handleAddToBasket}>
          Add Item Button - has onClick prop, accept the function that adds the
          selected item on the basket
        </button>

        <button onClick={handleAddByQR}>Add using QR button</button>
      </div>
    </div>
  );
}

export default BBItemSearch;
