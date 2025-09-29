import { useState } from "react";
import { BasketItem, ShopItem } from "../data/models";
import BBItemSearch from "./BBItemSearch";

//Main component? has search and list
function BBBasket() { // WHAT COMPONENT WILL OWN THE ADD BUTTON
  let [basketItems, setBasketItem] = useState<BasketItem[]>([]);
  let [itemToAdd, setItemToAdd] = useState<BasketItem>(); // maybe ref?

  function addBasketItem(){
    if(itemToAdd){
      //generate new Id for this, should be allowed to put multiple instances of the item
      setBasketItem((prevBasketItems)=>([...prevBasketItems, itemToAdd]));
    }
  }

  function handleAddBySearch(searchedItem: ShopItem | undefined){
    let newBasketItem = searchedItem as BasketItem;
    
    setItemToAdd(newBasketItem);
  }

  function handleSearchByQR() {
    // search item match for QR code, then fill selectedItem with details, (could add checkbox for auto add in list if a Shop is selected)

    //setItemToAdd(newBasketItem);
  }

  return (
    <div className="bg-green-900">
      <div>
        <BBItemSearch onSearchDone={handleAddBySearch} />
        <button 
          type="button"
          className="bg-red-200" 
          onClick={addBasketItem}
        >
          Add user Searched Item
        </button>
        <button onClick={handleSearchByQR}>Add using QR button</button>
      </div>

      <div>
        <div>{itemToAdd?.name}</div>
        <ul>
          {
            basketItems.map((item)=>{
              return(
                <li key={item.id}>{item.name}</li>
              );
            })
          }
        </ul>
        <div>
          Top section: Just a sortable completable deletable list items checked
          are sorted at the bottom has Done Grabbing/Go Pay button where checked
          items are removed from the basket and moved to a different "bought list"
        </div>
      </div>

      <div>
        Bought section, different list hidden and expandable full screen: all
        marked as checked(Bought) non-sortable but deletable, shows price has
        clear items, permanently removing items(future feature is to save it as
        template and autofill basket with previously bought items) can also be
        an option in as filter in search or just a different page where you can
        view a list of previously bought items, multiple select them and then
        add to list back to the basket page
      </div>
    </div>
  );
}
export default BBBasket;
