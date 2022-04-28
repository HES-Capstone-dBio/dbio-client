import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";
import theme from "./components/Layout/Theme";
import { ThemeProvider } from "@mui/material";
import Auth0ProviderWithHistory from "./auth/Auth0ProviderWithHistory";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <Router>
    <Auth0ProviderWithHistory>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById("root")
);
