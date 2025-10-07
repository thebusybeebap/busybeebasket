import { Shop, ShopItem } from "../data/models";

//BUG: shop name showing when there is selected shop and not showing when there is no selected shop. should be the other way around

function ShopItemDetails(
  item: ShopItem,
  //showShopName: boolean,
  selectedShop?: Shop,
) {
  console.dir(item);
  return (
    <div className="flex">
      {selectedShop ? null : ( // works only for sinlge shop selection
        <div className="flex-2 p-1">
          <span>Shop: </span>
          <span
            className={
              !selectedShop && item.shopName === "NONE" ? "bg-amber-200" : ""
            }
          >
            {item.shopName}
          </span>
        </div>
      )}

      {"price" in item ? (
        <span className="flex-1">
          {"Price: "}
          &#8369;
          {(item.price ?? 0).toFixed(2)}
        </span>
      ) : null}
    </div>
  );
}

export default ShopItemDetails;
