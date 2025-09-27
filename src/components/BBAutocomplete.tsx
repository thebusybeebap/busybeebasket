import { useRef, useState } from "react";

export interface BBSearchable{
  id: string;
  name: string;
}

export interface BBAutocompleteProps<T>{
  searchValue: string;
  updateSearchValue: (val: string) => void
  suggestionsFunction: (searchQuery: string) => Promise<T[]>;
  selected: T | undefined;
  onSelect: (selected?: T) => void;
  onCreateNew?: <T extends BBSearchable>(name: string) => Promise<T>;
  showNew?: (toMatch: T) => boolean;
  placeHolder?: string;
}

function BBAutocomplete<T extends BBSearchable>({
  searchValue,
  updateSearchValue,
  suggestionsFunction,
  selected,
  onSelect,
  onCreateNew,
  showNew, // boolean state prop
  placeHolder,
}: BBAutocompleteProps<T>) {

  let [suggestions, setSuggestions] = useState<Array<T>>([]);
  let [showCreateOption, setShowCreateOption] = useState(false); // Move out?
  let searchInputRef = useRef<HTMLInputElement>(null);

  function _focusOnSearchInput() {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }

  function handleSelect(selected: T) {
    onSelect(selected);
    updateSearchValue(selected.name);
    setSuggestions([]);
    setShowCreateOption(false);
    _focusOnSearchInput();
  }

  function handleCreateNewOption(name: string) {
    if (typeof onCreateNew === "function") {
      onCreateNew(name).then((result)=>{
        updateSearchValue(result.name);
        setSuggestions([]);
        setShowCreateOption(false);
        _focusOnSearchInput()
      });
    }
  }

  function handleSearchClear() {
    updateSearchValue("");
    setSuggestions([]);
    setShowCreateOption(false);
    onSelect();
  }

  function resetNoSelected() {
    if (selected) {
      updateSearchValue(selected.name);
    } else {
      updateSearchValue("");
    }
    setSuggestions([]);
    setShowCreateOption(false);
  }

  function populateSuggestionsFromSearchValue(event: React.ChangeEvent<HTMLInputElement>) {
    let newSearchValue = event.target.value;
    updateSearchValue(newSearchValue);

    if (newSearchValue === "" || newSearchValue === undefined) {
      setSuggestions([]);
      setShowCreateOption(false);
      onSelect();
      return;
    }
    
    suggestionsFunction(newSearchValue).then((suggestionsResult)=>{
      setSuggestions(suggestionsResult);

      if(typeof showNew === "function"){// this needs to be moved to persist layer, since there will be an issue if we limit the suggestions returned to 10, and we support multiple shop selection, simple solution would be limit number of suggestions same to the limit of multiple shops user can select
        let isSearchValueExactMatch = suggestionsResult.some(
          (element) => element.name.trim().toLowerCase() === newSearchValue.trim().toLowerCase()
        );
        let isFilterMatched = suggestionsResult.some((element) => showNew(element));
        setShowCreateOption(!(isFilterMatched && isSearchValueExactMatch));
      }
      else{
        setShowCreateOption(true);
      }
    });
  }

  function populateSuggestionsFromSelected(event: React.FocusEvent<HTMLInputElement>) {
    if(selected){
      suggestionsFunction(selected.name).then((suggestionsResult)=>{
        setSuggestions(suggestionsResult);
        setShowCreateOption(false);
      });
    }
  }

  return (
    <div className="m-1">
      <div className="group w-full border">
        <button
          disabled={searchValue === ""}
          onMouseDown={handleSearchClear}
          className={
            searchValue === ""
              ? "invisible"
              : "invisible group-focus-within:visible"
          }
        >
          Clear
        </button>
        <input
          ref={searchInputRef}
          type="text"
          value={searchValue}
          placeholder={placeHolder}
          onChange={populateSuggestionsFromSearchValue}
          onFocus={populateSuggestionsFromSelected}
          onBlur={resetNoSelected}
          className="border w-full p-1"
        />
      </div>

      <ul className="absolute z-10 w-full ml-1 p-1 bg-red-700 shadow-lg">
        {suggestions.map((suggestion) => {
          return (
            <li
              onMouseDown={() => handleSelect(suggestion)}
              key={suggestion.id}
            >
              {suggestion.name}
            </li>
          );
        })}

        {showCreateOption ? (
          <li onMouseDown={() => handleCreateNewOption(searchValue)}>
            {'Add New "' + searchValue + '"'}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default BBAutocomplete;