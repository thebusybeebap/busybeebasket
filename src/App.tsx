import PWABadge from "./PWABadge.tsx";
import "./App.css";
import BBAutocomplete, { BBSearchable } from "./ui/BBAutocomplete.tsx";
import { useState } from "react";
import { v7 as uuidv7 } from "uuid";

///TODELETE
import dummyDataAPI, {
  BasketItem,
  Store,
  Item,
  StoreItemDB,
  StoreItem,
} from "./utils/data.ts";
let { getStoreItems, getStores } = dummyDataAPI();
///TODELETE

let ItemStoreList = getStores(); // figure out how to limit what to fetch initial
let ItemsList = getStoreItems(); // too much load if all is fetched

function App() {
  let [storeList, setStoreList] = useState<Array<Store>>(ItemStoreList);
  let [shelfItems, setShelfItems] = useState<Array<StoreItem>>(ItemsList); //initial fetch how to limit, fetch only if a store is selected? maybe add "all"(only UI option and disables filter) and "no store selected"(treated as actual store value in DB) options, could default to "no store selected"
  let [selectedStore, setSelectedStore] = useState<Store>(); //future: multiple store select
  let [selectedItem, setSelectedItem] = useState<StoreItem>();
  let [filteredItems, setFilteredItems] = useState<Array<StoreItem>>(ItemsList);

  function handleStoreSelect(store?: Store) {
    setSelectedStore(store);
    if (store) {
      //REFACTOR
      let newfilteredItems = shelfItems.filter(
        (item) => item.storeId === store.id
      );
      setFilteredItems(newfilteredItems);
    } else {
      setFilteredItems(shelfItems);
    }
  }

  function handleCreateNewStore(name: string) {
    let newID = uuidv7();
    let newStore = { id: newID, name: name };
    setStoreList([...storeList, newStore]);
    return newStore;
  }

  function handleItemSelect(item?: BasketItem) {
    //future: filter storelist to only stores with item available
    setSelectedItem(item);
  }

  function handleCreateNewItem(name: string) {
    let newID = uuidv7();
    let storeName = selectedStore?.name ?? undefined;
    let storeId = selectedStore?.id ?? "";
    let newItem = {
      id: newID + storeId,
      itemId: newID,
      name: name,
      storeId: storeId,
      storeName: storeName,
    };
    setShelfItems([...shelfItems, newItem]);
    return newItem;
  }

  return (
    <>
      <BBAutocomplete<Store>
        suggestionsDataSource={storeList}
        selected={selectedStore}
        onSelect={handleStoreSelect}
        onCreateNew={handleCreateNewStore}
        placeHolder="Search Store"
      />
      <BBAutocomplete<BasketItem>
        suggestionsDataSource={filteredItems}
        selected={selectedItem}
        onSelect={handleItemSelect}
        onCreateNew={handleCreateNewItem}
        showCreateOptionAlways={selectedStore === undefined}
        placeHolder="Search Item"
      />
      <PWABadge />
    </>
  );
}

export default App;
