export namespace PagingStrategies {
  export const PAGE_SIZE = 10;

  export function pageIndices(page: number, lastPossibleIndex: number) {
    let start = page;
    let calculatedEnd = start + PAGE_SIZE;
    let end =
      lastPossibleIndex > calculatedEnd ? calculatedEnd : lastPossibleIndex;
    return { start, end };
  }
}
