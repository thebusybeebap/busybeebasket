import { useRef, useState } from "react";
//consider replacing with @mui/base/useAutocomplete in the future
export interface BBSearchable {
  id: string;
  name: string;
}

function BBAutocomplete<T extends BBSearchable>({
  getSuggestions,
  onSelect,
  selected,
  onCreateNew,
  isCreatable = false,
  matchingOptions,
  placeHolder,
}: {
  getSuggestions: (searchValue: string) => T[];
  onSelect: (selected?: T) => void;
  selected?: T;
  onCreateNew?: (name: string) => T;
  isCreatable?: boolean | "always";
  matchingOptions?: (toMatch: T) => boolean;
  placeHolder?: string;
}) {
  let [searchValue, setSearchValue] = useState(selected?.name ?? "");
  let [suggestions, setSuggestions] = useState<Array<T>>([]);
  let [showCreateOption, setShowCreateOption] = useState(false);
  let searchInputRef = useRef<HTMLInputElement>(null);

  // check if working properly
  function _focusOnSearchInput() {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }

  function handleSelect(selected: T) {
    setSearchValue(selected.name);

    onSelect(selected);

    setSuggestions([]);
    setShowCreateOption(false);
    _focusOnSearchInput();
  }

  function handleCreateNewOption(name: string) {
    let newOption: T;
    if (typeof onCreateNew === "function") {
      newOption = onCreateNew(name);

      onSelect(newOption);

      setSuggestions([]);
      setShowCreateOption(false);
    }
    _focusOnSearchInput();
  }

  function handleSearchClear() {
    setSearchValue("");
    setSuggestions([]);
    setShowCreateOption(false);
    onSelect();
  }

  function resetNoSelected() {
    if (selected) {
      setSearchValue(selected.name);
    } else {
      setSearchValue("");
    }
    setSuggestions([]);
    setShowCreateOption(false);
  }

  //consider react-window to virtualize list of large number of options to render
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newSearchValue = event.target.value;
    setSearchValue(newSearchValue);

    if (newSearchValue === "" || newSearchValue === undefined) {
      setSuggestions([]);
      setShowCreateOption(false);
      onSelect();
      return;
    }
    let searchedSuggestions = getSuggestions(newSearchValue);
    setSuggestions(searchedSuggestions);

    let hasMatch = searchedSuggestions.some((data) => {
      let nameMatched =
        data.name.trim().toLowerCase() === newSearchValue.trim().toLowerCase();
      let optionsMatched = true;
      if (typeof matchingOptions === "function") {
        optionsMatched = matchingOptions(data);
      }
      return nameMatched && optionsMatched;
    });
    setShowCreateOption(!hasMatch);
  }

  return (
    <div>
      <div className="group">
        <input
          ref={searchInputRef}
          className="border"
          type="text"
          placeholder={placeHolder}
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

        {isCreatable && showCreateOption ? (
          <li onMouseDown={() => handleCreateNewOption(searchValue)} key="new">
            {'Add New "' + searchValue + '"'}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default BBAutocomplete;
