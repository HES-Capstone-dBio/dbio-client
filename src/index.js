import ReactDOM from "react-dom";
import { AuthContextProvider } from "./store/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";
import App from "./App";

ReactDOM.render(
  <AuthContextProvider>
          <App />
  </AuthContextProvider>,
  document.getElementById("root")
);
