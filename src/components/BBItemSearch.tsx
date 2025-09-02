import { useState } from "react";
import BBAutocomplete, { BBSearchable } from "../ui/BBAutocomplete";
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
  let [selectedItem, setSelectedItem] = useState<StoreItem>();

  //DUMMY DELETE
  function fakeStoreFetchFromDB() {
    //DEBOUNCE Tquery 300ms //cachefirst if possible, disable query initially
    return storeList;
  }
  //DUMMY DELETE
  function fakeItemFetchFromDB() {
    return shelfItems;
  }

  //STORES SEARCH SELECT
  function handleStoreSelect(store?: Store) {
    if (store) {
      setSelectedStore(store);
    } else {
      setSelectedStore(undefined);
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
  function _filterStores(
    searchValue: string,
    dataFetchFunction: () => Store[]
  ): Store[] {
    let cleanedValue = searchValue.trim().toLowerCase();

    let suggestionsDataSource = dataFetchFunction(); //useCallback? //do you really fetch every type?

    // useMemo?
    let filteredSuggestions = suggestionsDataSource.filter((data) => {
      let cleanedItemName = data.name.trim().toLowerCase();
      return cleanedItemName.match(cleanedValue);
    });

    return filteredSuggestions;
  }

  function getStoreSuggestions(searchValue: string) {
    return _filterStores(searchValue, fakeStoreFetchFromDB);
  }

  //ITEMS SEARCH SELECT
  function handleItemSelect(item?: StoreItem) {
    //not filtering stores based on item selected yet
    if (item) {
      setSelectedItem(item);
    } else {
      setSelectedItem(undefined);
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

  function handleItemInStoreFilter(item: StoreItem): boolean {
    return item.storeId === selectedStore?.id;
  }

  //ITEMS SEARCH FILTER
  function _filterItems(
    searchValue: string,
    dataFetchFunction: () => StoreItem[]
  ): StoreItem[] {
    let cleanedValue = searchValue.trim().toLowerCase();

    let suggestionsDataSource = dataFetchFunction(); //useCallback? //do you really fetch every type?

    // useMemo?
    let filteredSuggestions = suggestionsDataSource.filter((data) => {
      let cleanedItemName = data.name.trim().toLowerCase();
      let isFromSelectedStore = true;

      if (selectedStore) {
        isFromSelectedStore = selectedStore.id === data.storeId;
      }

      return cleanedItemName.match(cleanedValue) && isFromSelectedStore;
    });

    return filteredSuggestions;
  }

  function getItemsSuggestions(searchValue: string) {
    return _filterItems(searchValue, fakeItemFetchFromDB);
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
          getSuggestions={getStoreSuggestions}
          selected={selectedStore}
          onSelect={handleStoreSelect}
          onCreateNew={handleCreateNewStore}
          isCreatable={true}
          placeHolder="Search Store"
        />
      </div>
      <div>
        <BBAutocomplete<StoreItem>
          getSuggestions={getItemsSuggestions}
          selected={selectedItem}
          onSelect={handleItemSelect}
          onCreateNew={handleCreateNewItem}
          isCreatable={true}
          matchingOptions={handleItemInStoreFilter}
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
