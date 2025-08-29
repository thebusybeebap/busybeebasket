import PWABadge from "./PWABadge.tsx";
import "./App.css";
import BBAutocomplete from "./ui/BBAutocomplete.tsx";

type basketItem = {
  id: number;
  name: string;
  price: number;
  store: string;
};

let suggestionsDataSource: basketItem[] = [
  {
    id: 1,
    name: "milk",
    price: 100.0,
    store: "SM",
  },
  {
    id: 2,
    name: "Skimmed Milk",
    price: 150.0,
    store: "SM",
  },
  {
    id: 3,
    name: "Fish",
    price: 500.0,
    store: "Market",
  },
  {
    id: 4,
    name: "Oats",
    price: 400.0,
    store: "Market",
  },
  {
    id: 5,
    name: "Cheese",
    price: 20.0,
    store: "SM",
  },
];

function App() {
  return (
    <>
      <BBAutocomplete<basketItem>
        suggestionsDataSource={suggestionsDataSource}
      />
      <PWABadge />
    </>
  );
}

export default App;
