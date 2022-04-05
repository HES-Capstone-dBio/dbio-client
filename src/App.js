import "./App.css";
import React, { useContext } from "react";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./store/AuthContext";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import classes from "./App.module.css";

const App = () => {
  // Grab the Auth context to conditionally render components
  // based on whether the user is logged in.
  const ctx = useContext(AuthContext);

  return (
    <React.Fragment>
      <MainHeader onLogout={ctx.logoutHandler} />
      <main>
        <div className={classes["resource-section"]} id="snackbar">
          {!ctx.isLoggedIn && <Login />}
          {ctx.isLoggedIn && <Home />}
        </div>
      </main>
    </React.Fragment>
  );
};
export default App;
