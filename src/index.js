import ReactDOM from "react-dom";
import { AuthContextProvider } from "./store/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";
import App from "./App";
import { BrowserRouter, Switch, Route } from "react-router-dom";

ReactDOM.render(
  <AuthContextProvider>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <App />
        </Route>
      </Switch>
    </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById("root")
);
