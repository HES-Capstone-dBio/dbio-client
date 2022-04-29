import classes from "./Layout.module.css";
import { Fragment } from "react";
import Navigation from "./Navigation";

const Layout = (props) => {
  return (
    <Fragment>
      <div className={classes["snackbar"]} id="snackbar" />
      <Navigation children={props.children} />
    </Fragment>
  );
};

export default Layout;
