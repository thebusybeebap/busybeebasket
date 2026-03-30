import PWABadge from "./PWABadge.tsx";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { Route, Switch } from "wouter";
import Repository from "./pages/Repository.tsx";
import Basket from "./pages/Basket.tsx";

const ROUTES = { //TODO: make this importable
  Basket: '/',
  Repo: '/repo',
};

function App() {
  return (
    <>
      <div className="h-dvh bg-neutral-100 touch-manipulation">
          <Switch>
            <Route path={ROUTES.Basket} component={Basket}/>
            <Route path={ROUTES.Repo} component={Repository}/>
          </Switch>
      </div>
      <Toaster position="top-right" />
      <PWABadge />
    </>
  );
}

export default App;
