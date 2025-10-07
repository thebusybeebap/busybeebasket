import PWABadge from "./PWABadge.tsx";
import "./App.css";
import BBBasket from "./features/BBBasket.tsx";

function App() {
  //Wouter for simple routing of item/shop management pages https://github.com/molefrog/wouter
  return (
    <>
      <div className="h-dvh bg-neutral-100 px-4">
        <BBBasket />
      </div>
      <PWABadge />
    </>
  );
}

//<BBBasket />
//<BBList />

export default App;
