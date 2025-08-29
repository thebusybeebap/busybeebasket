function BBItemSearch() {
  return (
    <div>
      <span>BBAutocomplete - for store</span>
      <span>Filter data for suggestions based on store selection</span>
      <div>
        <span>
          BBAutocomplete - for item, passed with filtered items, pass onSelect
          function that set state of selected Item in this component with the
          one selected in the autocomplete component.
        </span>
        <span>
          Add Item Button - has onClick prop, accept the function that adds the
          selected item on the basket
        </span>
        <span>Add using QR button</span>
      </div>
    </div>
  );
}

export default BBItemSearch;
