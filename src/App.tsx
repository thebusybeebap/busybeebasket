import PWABadge from "./PWABadge.tsx";
import "./App.css";
import BBAutocomplete, { BBSearchable } from "./ui/BBAutocomplete.tsx";
import { useState } from "react";
import { v7 as uuidv7 } from "uuid";

interface BasketItem extends BBSearchable {
  id: string;
  name: string;
  price?: number;
  store?: string;
}
interface ItemStore extends BBSearchable {
  id: string;
  name: string;
}

interface AnyStore extends ItemStore {
  id: "0";
  name: "any";
}

const ANYSTORE: AnyStore = {
  id: "0",
  name: "any",
};

let ItemStoreList: [AnyStore, ...ItemStore[]] = [
  { ...ANYSTORE },
  {
    id: "1",
    name: "SM Aura",
  },
  {
    id: "2",
    name: "Market Market",
  },
  {
    id: "3",
    name: "Rob - Stamford",
  },
  {
    id: "4",
    name: "Marketplace - Venice",
  },
];

let ItemsList: BasketItem[] = [
  {
    id: "1",
    name: "milk",
    price: 100.0,
    store: "SM",
  },
  {
    id: "2",
    name: "Skimmed Milk",
    price: 150.0,
    store: "SM",
  },
  {
    id: "3",
    name: "Fish",
    price: 500.0,
    store: "Market",
  },
  {
    id: "4",
    name: "Oats",
    price: 400.0,
    store: "Market",
  },
  {
    id: "5",
    name: "Cheese",
    price: 20.0,
    store: "SM",
  },
];

function App() {
  let [storeList, setStoreList] = useState<Array<ItemStore>>(ItemStoreList);
  let [shelfItems, setShelfItems] = useState<Array<BasketItem>>(ItemsList);
  let [selectedStore, setSelectedStore] = useState<ItemStore>(); // maybe make it possible to allow select of multiple stores in the future

  function handleStoreSelect(store?: ItemStore) {
    setSelectedStore(store);
  }

  function handleCreateNewStore(name: string) {
    let newID = uuidv7();
    let newStore = { id: newID, name: name };
    setStoreList([...storeList, newStore]);
    return newStore;
  }

  function handleItemSelect(item?: BasketItem) {
    //update store list as well to only display stores that has the selected item(????) maybe not for now yet, JUST DISPLAY ALL for now
    return;
  }

  function handleCreateNewItem(name: string) {
    let newID = uuidv7();
    let newItem = { id: newID, name: name };
    setShelfItems([...shelfItems, newItem]);
    return newItem;
  }

  return (
    <>
      <h1>{selectedStore?.name}</h1>
      <BBAutocomplete<ItemStore>
        suggestionsDataSource={storeList}
        selected={selectedStore}
        onSelect={handleStoreSelect}
        onCreateNew={handleCreateNewStore}
      />
      <BBAutocomplete<BasketItem>
        suggestionsDataSource={shelfItems}
        onSelect={handleItemSelect}
        onCreateNew={handleCreateNewItem}
      />
      <PWABadge />
    </>
  );
}

export default App;
