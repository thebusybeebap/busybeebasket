import { Shop, ShopItem } from "../data/models";

//BUG: shop name showing when there is selected shop and not showing when there is no selected shop. should be the other way around

function ShopItemDetails(
  item: ShopItem,
  //showShopName: boolean,
  selectedShop?: Shop,
) {
  return (
    <>
      {selectedShop && item.shopName ? (
        <span
          className={
            selectedShop.id === item.shopId ? "bg-amber-900" : "bg-current"
          }
        >
          {"Store: " + item.shopName}
        </span>
      ) : null}
      {item.price ? <span>{"Price: " + item.price}</span> : null}
    </>
  );
}

export default ShopItemDetails;
