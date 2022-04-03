import React, {
  useEffect,
  useContext
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/AuthContext";

const Login = () => {

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    console.log(`Auth context login details is ${authCtx.torusDirectSdk}`);
    if (!authCtx.torusDirectSdk) {
      console.log('not logged in');
    } else {
      console.log('is logged in');
    }
  }, [authCtx.torusDirectSdk]);


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
