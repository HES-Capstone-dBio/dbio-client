import React from "react";
import { useSelector } from "react-redux";
import Navigation from "./Navigation";
import { userSelector } from "../../store/UserSlice";

import classes from "./MainHeader.module.css";

const MainHeader = (props) => {
  const { isLoggedIn } = useSelector(userSelector);

  return (
    <header className={classes["main-header"]}>
      <h1>dBio</h1>
      {isLoggedIn && <Navigation onLogout={props.onLogout} />}
    </header>
  );
};

export default MainHeader;
