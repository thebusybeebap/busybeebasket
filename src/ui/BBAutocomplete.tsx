/*
single file first
start with input with buttons and an already visible suggestions box/list
input value filters suggestions, but is empty first, only have value when input has value. dont forget to trim 
and lowercase matching

props and features
-clear option - button that clears input
-create new prop - option to add on data source (popup modal form to create new, can be passed as props as well custom create new form)
-filter prop - filter source data function(filter source before input value filtering, should match the type/interface the source is using, could use generic here maybe)
-data prop - needs to be state that can be added on and filtered
-
refactor into:
//useReducer might eb useful here
custom hooks that accepts generic <T>
component that accepts generic(check if this is needed)
compound element so you can style individual elements(check if this works, positions are not defined like buttons inside input not needed yet, only style hardcoded is the dropdown behavior, check if that can be retained while adding classname to component instance)
could use useMemo/ useCallback/ for when filtering from input value, if for example 3 bread items, and list doesnt change cause typing  b r e a d, matches the same items so a rerender is not necessary
*/

import { useRef, useState } from "react";

type Searchable = {
  // this components needs the data object type to have a name property of type string to work as intended
  name: string;
};

function BBAutocomplete<T extends Searchable>({
  suggestionsDataSource,
  onSelect,
  onCreateNew,
}: {
  suggestionsDataSource: Array<T>;
  onSelect?: (selected: T) => void;
  onCreateNew?: (selected: T) => void;
}) {
  //(suggestionsDataSource<T>, onSelect(<T>))
  // consider useReducer?
  let searchElementRef = useRef<HTMLInputElement>(null); //might be better to use useState if create new option is in the list as typing just results rerendring everytime
  let [searchValue, setSearchValue] = useState("");
  let [suggestions, setSuggestions] = useState<Array<T>>([]);
  let [showClear, setShowClear] = useState(false);
  let [isAddDisabled, setIsAddDisabled] = useState(true);
  let [selectedValue, setSelectedValue] = useState<string | null>(null); // might not be needed, just accept a prop onSelect, that accepts the selected value(same data type with passed data for suggestions)
  let [filters, setFilters] = useState<string[]>([]); // or filterfunction instead?

  function _cleanupAfterClear() {
    setSuggestions([]);
    setShowClear(false);
    setIsAddDisabled(true);
    setSelectedValue("");
  }

  function _filterSuggestions(searchValue: string) {
    // might be not needed, JUST FILTER the data BEFORE PASSING TO THIS COMPONENT
    // memoize? useMemo?

    //trim, lowercase on searchValue
    let cleanedSearchValue = searchValue.trim().toLowerCase();

    let filteredSuggestions = suggestionsDataSource.filter((item) => {
      //trim and lowercase itemS
      let cleanedItemName = item.name.trim().toLowerCase();
      return cleanedItemName.match(cleanedSearchValue);
    });
    //if there is filter, filter searchedsuggestions

    return filteredSuggestions;
  }

  function handleCreateNewOption() {
    if (typeof onCreateNew === "function") {
      //onCreateNew(newOption);
    }
  }

  function handleSelect() {
    // called when selecting from suggestions or after creating a new option

    //createNewSelection

    let selected = searchValue; // OR selected value from list // could be just an ID
    setSelectedValue(selected);

    if (typeof onSelect === "function") {
      //onSelect(selected);
    }

    //also handle here setting state values outside the component like how is the selected value accessed by outside? have an onSelect prop that is run here also
  }

  function handleSearchClear() {
    setSearchValue("");
    _cleanupAfterClear();
  }

  function handleSearchUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    let newSearchValue = event.target.value;
    setSearchValue(newSearchValue);

    if (newSearchValue === "") {
      _cleanupAfterClear();
      return;
    }

    setShowClear(true);
    setIsAddDisabled(false);
    let searchedSuggestions = _filterSuggestions(searchValue);

    setSuggestions(searchedSuggestions); // add matchType/searchType option, if match is word/letters exists(ie: typing a could show, apple, banana, crab) or match per letter as you type in order(ie: typing a shows apple, atis, acorn) or could do a combination of 2 live search using first type then at a character threshold change search type
  }

  return (
    <div>
      <input
        className="border"
        type="text"
        value={searchValue}
        onChange={handleSearchUpdate}
      />
      {showClear ? <button onClick={handleSearchClear}>Clear</button> : null}
      {searchValue !== "" ? (
        <ul>
          {suggestions.map((suggestion, index) => {
            return <li key={index}>{suggestion.name}</li>;
          })}
          <li>{'Add New "' + searchValue + '"'}</li>
        </ul>
      ) : null}
    </div>
  );
}

export default BBAutocomplete;
