//pass the dialog modal as child element that accept the create function to add on the source data
// dialog is needed on the Basket component not in the autocomplete or search as you dont need details yet on auto complete and add
//might not be even needed as just switch page(client routing) when adding details

import { useRef } from "react";

//!!! PROBABLY WON'T BE NEEDED !!!!!

let newOptionDialogRef = useRef<HTMLDialogElement>(null);

function BBModal() {
  return (
    <dialog ref={newOptionDialogRef}>
      <div>TEST</div>
      <form method="dialog">
        <button formMethod="dialog">close</button>
      </form>
    </dialog>
  );
}

export default BBModal;
