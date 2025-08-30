import { useRef, useState } from "react";

export interface BBSearchable {
  // this components needs the data object type to have a name property of type string to work as intended
  name: string;
}

function BBAutocomplete<T extends BBSearchable>({
  suggestionsDataSource,
  selected,
  onSelect,
  onCreateNew,
}: {
  suggestionsDataSource: Array<T>;
  selected?: T;
  onSelect?: (selected?: T) => void;
  onCreateNew?: (name: string) => T;
}) {
  let [searchValue, setSearchValue] = useState(selected?.name ?? "");
  let [suggestions, setSuggestions] = useState<Array<T>>([]);
  let [hideNewOption, setHideNewOption] = useState(true);
  let searchInputRef = useRef<HTMLInputElement>(null);

  function _filterSuggestions(value: string) {
    let cleanedValue = value.trim().toLowerCase();
    let hasExactMatch = false;

    // useMemo?
    let filteredSuggestions = suggestionsDataSource.filter((item) => {
      let cleanedItemName = item.name.trim().toLowerCase();
      let isCurrentMatched = cleanedItemName === cleanedValue;
      hasExactMatch = hasExactMatch || isCurrentMatched; // to refactor, how to do this outside this function but still no extra search
      return cleanedItemName.match(cleanedValue);
    });

    setHideNewOption(hasExactMatch);

    return filteredSuggestions;
  }

  function _focusOnSearchInput() {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }

  function handleSelect(selected: T) {
    _focusOnSearchInput();

    setSearchValue(selected.name);

    if (typeof onSelect === "function") {
      onSelect(selected);
    }
  }
  function handleCreateNewOption(name: string) {
    _focusOnSearchInput();

    let newOption: T;
    if (typeof onCreateNew === "function") {
      newOption = onCreateNew(name);

      if (typeof onSelect === "function") {
        onSelect(newOption);
      }
    }
  }

  function handleSearchClear() {
    setSearchValue("");
    setSuggestions([]);
    setHideNewOption(true);
    if (typeof onSelect === "function") {
      onSelect();
    }
  }

  function resetNoSelected() {
    if (selected) {
      setSearchValue(selected.name);
    } else {
      setSearchValue("");
    }
    setSuggestions([]);
    setHideNewOption(true);
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newSearchValue = event.target.value;
    setSearchValue(newSearchValue);

    if (newSearchValue === "") {
      setSuggestions([]);
      setHideNewOption(true);
      if (typeof onSelect === "function") {
        onSelect();
      }
      return;
    }

    let searchedSuggestions = _filterSuggestions(newSearchValue);

    setSuggestions(searchedSuggestions);
  }

  return (
    <div>
      <div className="group">
        <input
          ref={searchInputRef}
          className="border"
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onBlur={resetNoSelected}
        />
        <button
          disabled={searchValue === ""}
          className={
            searchValue === ""
              ? "invisible"
              : "invisible group-focus-within:visible"
          }
          onMouseDown={handleSearchClear}
        >
          Clear
        </button>
      </div>

      <ul>
        {suggestions.map((suggestion, index) => {
          return (
            <li onMouseDown={() => handleSelect(suggestion)} key={index}>
              {suggestion.name}
            </li>
          );
        })}

        {hideNewOption ? null : (
          <li onMouseDown={() => handleCreateNewOption(searchValue)}>
            {'Add New "' + searchValue + '"'}
          </li>
        )}
      </ul>
    </div>
  );
}

export default BBAutocomplete;
