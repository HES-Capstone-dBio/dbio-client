import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import { loginUser, clearState } from "../../actions/UserActions";
import showSnackbar from "../UI/Snackbar/Snackbar";

const Login = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.loginError) {
      showSnackbar("Unable to log into dBio", "error");
      dispatch(clearState());
    }
  }, [dispatch, props.loginError]);

  const loginButtonHandler = (event) => {
    event.preventDefault();
    dispatch(loginUser());
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
