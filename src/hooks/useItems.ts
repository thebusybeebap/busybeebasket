import { useLiveQuery } from "dexie-react-hooks";
import bbbdb from "../data/bbddb";

async function useItems(queryString: string){

  let items = useLiveQuery(
    async () => {
      let items = await bbbdb.items
        .toArray();
      return items;
    },
    [queryString]
  );

  return {items};
}

export default useItems;
