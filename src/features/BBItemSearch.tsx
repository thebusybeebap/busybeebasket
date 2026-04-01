import { useState } from "react";
import { PersistItems } from "../services/Items.js";

import useShop from "../hooks/useShop";
import useShopItem from "../hooks/useShopItem";

import { Shop, ShopItem } from "../data/models";
import BBAutocomplete from "../components/BBAutocomplete";
import ShopItemDetails from "../components/ShopItemDetails";
import BarcodeScanner from "../components/BarcodeScanner";
import { DatabaseSearch, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import BouncyButton from "../components/ui/BouncyButton.js";
import { useLocation } from "wouter";

//TODO: !!BUGFIX, shopname showing when there is a selected shop, and not showing if there is no selected shop

interface BBItemSearchProps {
  onSelectItemAction: (searchedItem: ShopItem|undefined) => void;
  onExploreAction?: () => void;
  onSelectShopAction?: (searchedShop: Shop|undefined) => void;
  onShopClear?: ()=>void;
  onItemClear?: ()=>void;
  buttonMode?: boolean;
}

function BBItemSearch({
  onSelectItemAction,
  onExploreAction,
  onSelectShopAction,
  onShopClear,
  onItemClear,
  buttonMode = true,
}: BBItemSearchProps) {
//TODO: MAYBE JUST REMOVE THE SEARCH BUTTONS AND AUTO DISPLAY DETAILS ON SELECT. This actually introduces unnecessary code cohession so it needs to be refactored later on to remove that. maybe pass a "mode"/"currentpage" instead
//isButtonMode
//in handleShopSelect at end if inRepo auto-call onSelectShopAction
//in handleItemSelect AND handleCreateNewItem at end if inRepo auto-call onSelectItemAction


  let [selectedShop, setSelectedShop] = useState<Shop>();
  let { fetchShopsByNameQuery, createShop } = useShop();
  let [shopSearchValue, setShopSearchValue] = useState("");
  let [selectedItem, setSelectedItem] = useState<ShopItem>();
  let [itemSearchValue, setItemSearchValue] = useState("");
  let {
    fetchItemsInShopByNameQuery,
    fetchItemsInAllShopsByNameQuery,
    createShopItem,
  } = useShopItem();
  const [location, navigate] = useLocation();

  let notHome = location != "/"; //TODO: inRepo instead??

  /*function handleClearSearch(){
    setSelectedShop(undefined);
    setShopSearchValue("");
    setSelectedItem(undefined);
    setItemSearchValue("");
  }*/

  async function setItemSearchValueByBarcode(scannedBarcode: string) {
    let scannedItem = await PersistItems.getItemByBarcode(scannedBarcode);
    if (scannedItem) {
      setSelectedItem(undefined);
      setItemSearchValue(scannedItem.name);

      //TODO: FIX When scanning a selected item, it does show suggestions, and even different shop.. not sure weird
    } else {
      toast.error("Barcode Not Found! Add the Barcode to an Item first.");
      //TODO: CALL TOAST HERE
      //setSelectedItem(undefined); //TODO: REMOVE keep values since nothing is selected
      //setItemSearchValue("Empty"); //TODO: Make a toast?
    }
  }

  function handleAddAction() {
    if (selectedItem) {
      onSelectItemAction(selectedItem);
    }
  }

  function handleBackToHome(){
    navigate('/');
  }

  function handleExploreAction() {
    if(typeof onExploreAction === 'function') {
      onExploreAction();
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
      setShopSearchValue("");
      setSelectedItem(undefined); //TODO: Update that item only "clears" if item does not exist in shop
      setItemSearchValue("");
    }

    if(buttonMode === false && typeof onSelectShopAction === 'function'){
        onSelectShopAction(shop);
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

    if(buttonMode === false && typeof onSelectItemAction === 'function'){
      onSelectItemAction(item);
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
    if(buttonMode === false && typeof onSelectItemAction === 'function'){
      onSelectItemAction(newShopItem);
    }
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

  return (
    <>
      <div className="flex w-full flex-1 gap-1 p-2 bg-bb-prim">

        <div className="flex flex-1 flex-col gap-2 p-2 bg-bb-base border-2 border-bb-sec">

          <div className="flex flex-1 gap-1">
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

          <div className="flex gap-1 flex-1">
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
            <BarcodeScanner callAfterScan={setItemSearchValueByBarcode} />  
          </div>

        </div>

        <div className="flex h-auto flex-col gap-1">
          <div className="flex-2/5 pr-1">
            {notHome ?
              <BouncyButton type="icononly" size="ty" onClick={handleBackToHome}>
                <X size={25} strokeWidth={1.5} className="text-bb-prim"/>
              </BouncyButton> :
              <BouncyButton type="icononly" size="ty" onClick={handleExploreAction}>
                <DatabaseSearch size={25} strokeWidth={1.5} className="text-bb-prim"/>
              </BouncyButton>
            }
          </div>
          <div className="flex-3/5">
            {buttonMode ?
              <BouncyButton type="icononly" size="tl" onClick={handleAddAction}>
                <Plus size={45} className="text-bb-prim"/>
              </BouncyButton> 
              : null}
          </div>
        </div>

      </div>
    </>
  );
}

export default BBItemSearch;

/*

            <BouncyButton type="icononly" size="ty" onClick={handleShopSearch}>
              <Search size={35} className="text-bb-prim"/>
            </BouncyButton>

        <div className="flex h-auto flex-col gap-1">
          <div className="flex-2/5 pr-1">
            {notInMain ?
              <BouncyButton type="icononly" size="ty" onClick={handleBackToMain}>
                <X size={25} strokeWidth={1.5} className="text-bb-prim"/>
              </BouncyButton> :
              <BouncyButton type="icononly" size="ty" onClick={handleExploreAction}>
                <DatabaseSearch size={25} strokeWidth={1.5} className="text-bb-prim"/>
              </BouncyButton>
            }
          </div>
          <div className="flex-3/5">
            {canSearchShop ?
              <BouncyButton type="icononly" size="tl" onClick={handleShopSearch}>
                <PackageSearch size={45} className="text-bb-prim"/>
              </BouncyButton> :
              <BouncyButton type="icononly" size="tl" onClick={handleAddAction}>
                <Plus size={45} className="text-bb-prim"/>
              </BouncyButton>
            }
          </div>
        </div>
*/
