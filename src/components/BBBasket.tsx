import BBAutocomplete from "../ui/BBAutocomplete";
import BBList from "../ui/BBList";

function BBBasket() {
  return (
    <div>
      <span>
        Top section: Just a sortable completable deletable list items checked
        are sorted at the bottom has Done Grabbing/Go Pay button where checked
        items are removed from the basket and moved to a different "bought list"
      </span>
      <span>
        Bought section, different list hidden and expandable full screen: all
        marked as checked(Bought) non-sortable but deletable, shows price has
        clear items, permanently removing items(future feature is to save it as
        template and autofill basket with previously bought items) can also be
        an option in as filter in search or just a different page where you can
        view a list of previously bought items, multiple select them and then
        add to list back to the basket page
      </span>
    </div>
  );
}
export default BBBasket;
