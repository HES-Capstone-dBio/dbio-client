import React, { useEffect, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/AuthContext";

const Login = () => {
  const authCtx = useContext(AuthContext);

  const loginButtonHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin();
  };

  return (
    <Card className={classes.login}>
      <Button type="Login" className={classes.btn} onClick={loginButtonHandler}>
        Login
      </Button>
    </Card>
  );
};

export default Login;
