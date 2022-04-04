import React, { useContext } from "react";

import classes from "./Navigation.module.css";
import AuthContext from "../../store/AuthContext";

const Navigation = () => {

  const ctx = useContext(AuthContext);

  return (
    <nav className={classes.nav}>
      <ul>
        {ctx.isLoggedIn && (
          <li>
            <button onClick={ctx.homeHandler}>Home</button>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <button onClick={ctx.createResourceHandler}>Create Resource</button>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <button onClick={ctx.onLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
