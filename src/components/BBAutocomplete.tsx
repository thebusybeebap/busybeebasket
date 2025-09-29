import { useRef, useState } from "react";

export interface BBSearchable{
  id: string;
  name: string;
}

export interface BBSuggestive<T>{
  suggestionsResult: T[];
  hasExactMatch?: boolean;
}

export interface BBSuggestiveFunction<T>{
  (searchQuery: string): Promise<BBSuggestive<T>>;
}

export interface BBAutocompleteProps<T>{
  searchValue: string;
  updateSearchValue: (val: string) => void
  suggestionsFunction: BBSuggestiveFunction<T>;
  selected: T | undefined;
  onSelect: (selected?: T) => void;
  onCreateNew?: <T extends BBSearchable>(name: string) => Promise<T>;
  placeHolder?: string;
  suggestionsDetails?: (item: T) => React.ReactNode;
}

function BBAutocomplete<T extends BBSearchable>({
  searchValue,
  updateSearchValue,
  suggestionsFunction,
  selected,
  onSelect,
  onCreateNew,
  placeHolder,
  suggestionsDetails
}: BBAutocompleteProps<T>) {

  let [suggestions, setSuggestions] = useState<Array<T>>([]);
  let [showCreateOption, setShowCreateOption] = useState(false);
  let searchInputRef = useRef<HTMLInputElement>(null);

  /*function _focusOnSearchInput() {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }*/

  function handleSelect(selected: T) {
    onSelect(selected);
    updateSearchValue(selected.name);
    setSuggestions([]);
    setShowCreateOption(false);
    //_focusOnSearchInput();
  }

  function handleCreateNewOption(name: string) {
    if (typeof onCreateNew === "function") {
      onCreateNew(name).then((result)=>{
        updateSearchValue(result.name);
        setSuggestions([]);
        setShowCreateOption(false);
        //_focusOnSearchInput();
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

    suggestionsFunction(newSearchValue).then(({suggestionsResult, hasExactMatch})=>{
      setSuggestions(suggestionsResult);
      setShowCreateOption(!hasExactMatch);
    });
  }

  function populateSuggestionsFromSelected(event: React.FocusEvent<HTMLInputElement>) {
    if(selected){
      suggestionsFunction(selected.name).then(({suggestionsResult})=>{
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
              <section>
                <span>{suggestion.name}</span>
              </section>
              {suggestionsDetails ? 
                <section>
                  {suggestionsDetails(suggestion)}
                </section> 
              : null}
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