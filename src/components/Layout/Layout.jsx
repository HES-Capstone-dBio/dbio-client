import MainHeader from "./MainHeader";
import classes from "./Layout.module.css";
import { Fragment } from "react";

const Layout = (props) => {
  return (
    <Fragment>
      <div className={classes["snackbar"]} id="snackbar" />
      <MainHeader />
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
