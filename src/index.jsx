import ReactDOM from "react-dom";
import { AuthContextProvider } from "./store/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import configureStore from "./store/ConfigureStore";

import "./index.css";
import App from "./App";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </Provider>,
  document.getElementById("root")
);
