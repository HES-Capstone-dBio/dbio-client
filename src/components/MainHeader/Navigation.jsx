import React from "react";
import { useDispatch } from "react-redux";
import classes from "./Navigation.module.css";
import { logoutUser } from "../../actions/UserActions";

const Navigation = () => {
  const dispatch = useDispatch();

  const logoutButtonHandler = (event) => {
    dispatch(logoutUser());
  };

  return (
    <nav className={classes.nav}>
      <ul>
        <li>
          <button>Home</button>
        </li>

        <li>
          <button>Create Resource</button>
        </li>

        <li>
          <button onClick={logoutButtonHandler}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
