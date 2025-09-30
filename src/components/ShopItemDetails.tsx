import { Shop, ShopItem } from "../data/models";

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
