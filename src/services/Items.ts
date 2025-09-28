import { FilterStrategies } from "../utils/FilterStrategies";
import bbbdb from "./bbddb";

export namespace PersistItems{
  export async function fetchItemsByNameQuery(nameQuery: string){
    let items = await bbbdb.items
      .filter((item) => FilterStrategies.filterByName(item, nameQuery))
      .toArray();
    return items;
  }
}