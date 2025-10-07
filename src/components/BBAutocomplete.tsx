import { CircleX } from "lucide-react";
import { useRef, useState } from "react";

//TODO: UI Items details and match
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

  function handleSelect(event: React.MouseEvent<HTMLLIElement>, selected: T) {
    event.preventDefault();
    event.stopPropagation();
    onSelect(selected);
    updateSearchValue(selected.name);
    setSuggestions([]);
    setShowCreateOption(false);
  }

  function handleCreateNewOption(
    event: React.MouseEvent<HTMLLIElement>,
    name: string,
  ) {
    event.preventDefault();
    event.stopPropagation();
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
    searchInputRef.current?.focus(); //TODO: TOFIX, FOCUS AFTER CLEAR
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
      suggestionsFunction(selected.name).then(
        ({ suggestionsResult, hasExactMatch }) => {
          setSuggestions(suggestionsResult);
          setShowCreateOption(!hasExactMatch);
        },
      );
    }
  }

  return (
    <div className="relative w-full">
      <div className="group relative w-full text-xl">
        <button
          disabled={searchValue === ""}
          onMouseDownCapture={handleSearchClear}
          className={
            "absolute top-1/2 right-1 -translate-y-1/2 transform opacity-40 hover:opacity-100 " +
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
          className={
            "w-full truncate rounded-xl border-2 py-1 pr-7 pl-2 focus:ring-2 focus:ring-amber-200 focus:outline-none"
          }
        />
      </div>

      <ul className="absolute z-10 w-full max-w-full rounded-xl bg-neutral-100 shadow-lg">
        {suggestions.map((suggestion) => {
          return (
            <li
              className={
                "cursor-pointer rounded-xl px-2 py-2 " +
                (searchValue === suggestion.name
                  ? "border-2 border-dashed border-amber-200 hover:bg-amber-200"
                  : "bg-neutral-100 hover:bg-neutral-200")
              }
              onMouseDownCapture={(event) => handleSelect(event, suggestion)}
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
            className="cursor-pointer rounded-xl border-2 border-dashed border-neutral-200 px-2 py-2 hover:bg-neutral-200"
            onMouseDownCapture={(event) =>
              handleCreateNewOption(event, searchValue)
            }
          >
            <span className="text-xl">
              <span className="opacity-50">+Add New </span>
              {'"' + searchValue.trim() + '"'}
            </span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default BBAutocomplete;
