export namespace FilterStrategies{

  export interface WithNameProperty{
    name: string;
  }

  export interface WithItemIdProperty{
    itemId: string;
  }

  export interface WithShopIdProperty{
    shopId: string;
  }
/*
  type matchFunction = () => boolean;

  export function queryMatchesName(){
    return element.name.trim().toLowerCase() === newSearchValue.trim().toLowerCase()
  }

  export function itemIsInShop(){
    
  }*/

  export function filterByName<T extends WithNameProperty>(element: T, query: string){
    return element.name.trim().toLowerCase().includes(query.trim().toLowerCase());
  }

  export function filterByIdInSet<T extends WithItemIdProperty>(element: T, setRef: Set<string>){
    return setRef.has(element.itemId)
  }

  export function matchesShopId<T extends WithShopIdProperty>(element: T, id: string){
    //when calling, if no provided id, default to "NONE" shop id.
    return element.shopId === id;
  }

/*
  export function hasExactMatchInList<T>(list: T[], matchingConditions: matchFunction[]){
    let isSearchValueExactMatch = suggestionsResult.some(
      (element) => element.name.trim().toLowerCase() === newSearchValue.trim().toLowerCase()
    );
    let isFilterMatched = suggestionsResult.some((element) => showNew(element));
  }

  export function isExactMatch(){

  }
*/
}
