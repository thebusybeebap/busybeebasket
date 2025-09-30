import PWABadge from "./PWABadge.tsx";
import "./App.css";
import BBBasket from "./features/BBBasket.tsx";

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

export default App;
