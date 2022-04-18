import "./App.css";
import React from "react";
import MainHeader from "./components/MainHeader/MainHeader";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import classes from "./App.module.css";
import { useSelector } from "react-redux";
import { userSelector } from "./store/UserSlice";
import { Backdrop, CircularProgress } from "@mui/material";

const App = () => {
  const { isFetching, isSuccess, isError } = useSelector(userSelector);
  return (
    <React.Fragment>
      <MainHeader />
      <main>
        <div className={classes["resource-section"]} id="snackbar">
          {!isSuccess && <Login loginError={isError} />}
          {isSuccess && <Home />}
          {isFetching && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </div>
      </main>
    </React.Fragment>
  );
};
export default App;
