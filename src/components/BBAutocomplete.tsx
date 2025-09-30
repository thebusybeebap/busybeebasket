import { CircleX } from "lucide-react";
import { useRef, useState } from "react";

export interface BBSearchable {
  id: string;
  name: string;
}

export interface BBSuggestive<T> {
  suggestionsResult: T[];
  hasExactMatch?: boolean;
}

export interface BBSuggestiveFunction<T> {
  (searchQuery: string): Promise<BBSuggestive<T>>;
}

export interface BBAutocompleteProps<T> {
  searchValue: string;
  updateSearchValue: (val: string) => void;
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
  suggestionsDetails,
}: BBAutocompleteProps<T>) {
  let [suggestions, setSuggestions] = useState<Array<T>>([]);
  let [showCreateOption, setShowCreateOption] = useState(false);
  let searchInputRef = useRef<HTMLInputElement>(null);

  function handleSelect(selected: T) {
    onSelect(selected);
    updateSearchValue(selected.name);
    setSuggestions([]);
    setShowCreateOption(false);
  }

  function handleCreateNewOption(name: string) {
    if (typeof onCreateNew === "function") {
      onCreateNew(name).then((result) => {
        updateSearchValue(result.name);
        setSuggestions([]);
        setShowCreateOption(false);
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

  function populateSuggestionsFromSearchValue(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    let newSearchValue = event.target.value;
    updateSearchValue(newSearchValue);

    if (newSearchValue === "" || newSearchValue === undefined) {
      setSuggestions([]);
      setShowCreateOption(false);
      onSelect();
      return;
    }

    suggestionsFunction(newSearchValue).then(
      ({ suggestionsResult, hasExactMatch }) => {
        setSuggestions(suggestionsResult);
        setShowCreateOption(!hasExactMatch);
      },
    );
  }

  function populateSuggestionsFromSelected(
    event: React.FocusEvent<HTMLInputElement>,
  ) {
    if (selected) {
      suggestionsFunction(selected.name).then(({ suggestionsResult }) => {
        setSuggestions(suggestionsResult);
        setShowCreateOption(false);
      });
    }
  }

  return (
    <div className="relative w-full">
      <div className="group w-full text-xl">
        <button
          disabled={searchValue === ""}
          onMouseDown={handleSearchClear}
          className={
            "absolute top-2 right-1 z-10 opacity-40 hover:opacity-100 " +
            (searchValue === ""
              ? "invisible"
              : "invisible group-focus-within:visible")
          }
        >
          <CircleX />
        </button>

        <input
          ref={searchInputRef}
          type="text"
          value={searchValue}
          placeholder={placeHolder}
          onChange={populateSuggestionsFromSearchValue}
          onFocus={populateSuggestionsFromSelected}
          onBlur={resetNoSelected}
          className={"w-full truncate rounded-sm border py-1 pr-7 pl-2"}
        />
      </div>

      <ul className="absolute z-10 w-full max-w-full bg-red-700 shadow-lg">
        {suggestions.map((suggestion) => {
          return (
            <li
              className="bg-amber-300 px-1"
              onMouseDown={() => handleSelect(suggestion)}
              key={suggestion.id}
            >
              <section>
                <span className="text-xl">{suggestion.name}</span>
              </section>
              {suggestionsDetails ? (
                <section className="indent-2 text-xs">
                  {suggestionsDetails(suggestion)}
                </section>
              ) : null}
            </li>
          );
        })}

        {showCreateOption ? (
          <li
            className="px-1"
            onMouseDown={() => handleCreateNewOption(searchValue)}
          >
            {'Add New "' + searchValue + '"'}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default BBAutocomplete;
