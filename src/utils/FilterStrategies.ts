export namespace FilterStrategies {

  export interface WithNameProperty{
    name: string;
  }

  export function filterByName<T extends WithNameProperty>(element: T, query: string){
    return element.name.trim().toLowerCase().includes(query.trim().toLowerCase());
  }

}
