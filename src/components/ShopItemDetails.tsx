import { ShopItem } from "../data/models";

function ShopItemDetails(item: ShopItem, showShopName: boolean){
  return(
    <>
      {(showShopName && item.shopName) ? <span>-{item.shopName}</span> : null}
      {item.price ? <span>-{item.price}</span> : null}
    </>
  );
}

export default ShopItemDetails;