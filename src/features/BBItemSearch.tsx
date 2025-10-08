import { useState } from "react";

import useShop from "../hooks/useShop";
import useShopItem from "../hooks/useShopItem";

import { Shop, ShopItem } from "../data/models";
import BBAutocomplete from "../components/BBAutocomplete";
import ShopItemDetails from "../components/ShopItemDetails";
import {
  PackageSearch,
  //ScanBarcode,
  SquarePlus,
} from "lucide-react";

//TODO: !!BUGFIX, shopname showing when there is a selected shop, and not showing if there is no selected shop

function BBItemSearch({
  onAddAction,
}: {
  onAddAction: (searchedItem: ShopItem) => void;
}) {
  let [selectedShop, setSelectedShop] = useState<Shop>();
  let { fetchShopsByNameQuery, createShop } = useShop();
  let [shopSearchValue, setShopSearchValue] = useState("");

  let [selectedItem, setSelectedItem] = useState<ShopItem>();
  let {
    fetchItemsInShopByNameQuery,
    fetchItemsInAllShopsByNameQuery,
    createShopItem,
  } = useShopItem();
  let [itemSearchValue, setItemSearchValue] = useState("");

  function handleAddAction() {
    if (selectedItem) {
      onAddAction(selectedItem);
    }
  }

  //SHOP
  function handleShopSelect(shop?: Shop) {
    if (shop) {
      setSelectedShop(shop);
      if (selectedItem) {
        if (selectedItem.shopId !== shop.id) {
          // create a function that updates all selectedItem related
          setSelectedItem(undefined);
          setItemSearchValue("");
          //onSearchDone(undefined);
        }
      }
    } else {
      setSelectedShop(undefined);
    }
  }

  async function handleCreateNewShop<Shop>(name: string) {
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
    try {
      ({ shops, hasExactMatch } = await fetchShopsByNameQuery(searchQuery)); //is enclosing in () the best to do here?
    } catch (error) {
      console.error("Failed to fetch Shops:", error);
    } finally {
      return { suggestionsResult: shops, hasExactMatch };
    }
  }

  //ITEM
  function handleItemSelect(item?: ShopItem) {
    //TODO: to filter Shop selections when an item is selected, based if item is in Shop
    if (item) {
      setSelectedItem(item);

      if (!selectedShop && item.shopName !== "NONE") {
        // TODO REFACTOR "NONE" handling
        let shopFromSelectedItem = {
          //find better way of doing this
          id: item.shopId,
          name: item.shopName,
        };
        setSelectedShop(shopFromSelectedItem);
        setShopSearchValue(shopFromSelectedItem.name); // do this for shop select also, clear item if item is not in selected shop
        // search value on autocomplete component
      }
    } else {
      setSelectedItem(undefined); //when does this happen?? when is the selectedItem state cleared? check
    }
  }

  async function handleCreateNewItem<ShopItem>(name: string) {
    let newShopItem;

    let shopId = selectedShop?.id;
    try {
      newShopItem = await createShopItem({ shopId: shopId, newItemName: name });
    } catch (error) {
      console.error("Failed to Create New Shop Item:", error);
    }

    setSelectedItem(newShopItem);
    return newShopItem as ShopItem;
  }

  async function getItemsSuggestions(searchQuery: string) {
    let shopItems: ShopItem[] = []; // TODO: refactor useShopItems function to not return undefined
    let hasExactMatch = false;

    if (selectedShop) {
      try {
        ({ shopItems, hasExactMatch } = await fetchItemsInShopByNameQuery(
          selectedShop.id,
          searchQuery,
        ));
      } catch (error) {
        console.error("Failed to fetch shop items:", error);
      }
    } else {
      try {
        ({ shopItems, hasExactMatch } =
          await fetchItemsInAllShopsByNameQuery(searchQuery));
      } catch (error) {
        console.error("Failed to fetch shop items:", error);
      }
    }
    return { suggestionsResult: shopItems, hasExactMatch };
  }

  //function handleSearchByQR() {
  // search item match for QR code, then fill selectedItem with details, (could add checkbox for auto add in list if a Shop is selected)
  //setItemToAdd(newBasketItem);
  //}

  return (
    <div className="flex flex-col gap-2 bg-neutral-100">
      <div className="flex-1 p-1">
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
      <div className="flex w-full flex-1 gap-1 border-2 border-solid p-2">
        <PackageSearch />
        <BBAutocomplete<ShopItem>
          suggestionsFunction={getItemsSuggestions}
          selected={selectedItem}
          onSelect={handleItemSelect}
          onCreateNew={handleCreateNewItem}
          placeHolder="Search Item"
          searchValue={itemSearchValue}
          updateSearchValue={setItemSearchValue}
          suggestionsDetails={(item) => ShopItemDetails(item, selectedShop)}
        />
        <button className="cursor-pointer rounded-lg text-gray-700 transition-all hover:bg-gray-200 active:scale-90 active:opacity-50">
          <SquarePlus size={40} strokeWidth={1.5} onClick={handleAddAction} />
        </button>
      </div>
    </div>
  );
}

export default BBItemSearch;

/**BARCODE
<button>
  <ScanBarcode
    onClick={() =>
      console.log(
        "to implement, function that searches persist layer and then fill the search input boxes.NOT auto add to list, still need to click +",
      )
    }
  />
</button>
 */
