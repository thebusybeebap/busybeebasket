import { ShopItem } from "../data/models";

function ShopItemDetails(item: ShopItem, showShopName: boolean) {
  return (
    <>
      {showShopName && item.shopName ? (
        <span>{"Store: " + item.shopName}</span>
      ) : null}
      {item.price ? <span>{"Price: " + item.price}</span> : null}
    </>
  );
}

export default ShopItemDetails;
