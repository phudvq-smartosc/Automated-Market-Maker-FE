// import TokenSwapPage from "./pages/TokenSwapPage";
import AddLiquidityPage from "./pages/AddLiquidity/AddLiquidityPage";
import ExplorerPage from "./pages/Explorer/ExplorerPage";
import TokenSwapPage from "./pages/TokenSwap/TokenSwapPage";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import UtilPage from "./pages/UtilsPage/UtilsPage";
import PortfolioPage from "./pages/Portfolio/PortfolioPage";
import BurnLiquidityPage from "./pages/BurnLiquidity/BurnLiquidityPage";
import LiveChart from "./components/liveChart/LiveChart";

export default function App() {
  return (
    <>
      <Router >
        <div className="box-border w-full overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-500 h-1/2">
          <Switch>
          <Redirect exact from="/" to="/swap" />

            <Route path="/swap">
              <div className="flex items-center justify-center w-screen h-screen font-display">
                <TokenSwapPage />
              </div>
            </Route>

            <Route path="/explorer">
              <div className="flex items-center justify-center w-screen h-screen font-display">
                <ExplorerPage />
              </div>
            </Route>
            <Route path="/addliquid">
              <div className="flex items-center justify-center w-screen h-screen font-display">
                <AddLiquidityPage />
              </div>
            </Route>
            <Route path="/burnliquid">
              <div className="flex items-center justify-center w-screen h-screen font-display">
                <BurnLiquidityPage />
              </div>
            </Route>
            <Route path="/util">
              <div className="flex items-center justify-center w-screen h-screen font-display">
                <UtilPage />
              </div>
            </Route>
            <Route path="/historyTx">
              <div className="flex items-center justify-center w-screen h-screen font-display">
                <PortfolioPage />
              </div>
            </Route>
            <Route path="/pair/:id">
              <div className="flex items-center justify-center w-screen h-screen font-display">
                <LiveChart />
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}
