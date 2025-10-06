import PWABadge from "./PWABadge.tsx";
import "./App.css";
import BBBasket from "./features/BBBasket.tsx";
import BBList from "./components/BBList/BBList.tsx";
import BBListTest from "./test/components/BBListTest.tsx";

function App() {
  return (
    <>
      <div className="h-dvh bg-purple-900 px-4">
        <BBBasket />
      </div>
      <PWABadge />
    </>
  );
}

//<BBBasket />
//<BBList />

export default App;
