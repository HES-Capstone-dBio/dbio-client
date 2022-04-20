import "./App.css";
import React, { Fragment, useEffect } from "react";
import MainHeader from "./components/MainHeader/MainHeader";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import classes from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "./store/UserSlice";
import { Backdrop, CircularProgress } from "@mui/material";
import { initializeIroncoreSDK } from "./actions/UIActions";
import * as IronWeb from "@ironcorelabs/ironweb";

const App = () => {
  const { isLoggedIn, idToken, privateKey, isFetching, isSuccess, isError } =
    useSelector(userSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    // Reinitialize IronCore SDK if the page is refreshed by
    // dispatching the initializeIroncoreSDK action
    if (!IronWeb.isInitialized() && isLoggedIn) {
      dispatch(initializeIroncoreSDK({ idToken, privateKey }));
    }
  }, [dispatch, idToken, isLoggedIn, privateKey]);

  return (
    // <Fragment>
    //   <MainHeader />
    //   <main>
    //     <div className={classes["resource-section"]} id="snackbar">
    //       {!isSuccess && <Login loginError={isError} />}
      <Layout>
        <Route path="/" exact>
          <Redirect to="/" />
        </Route>
        <Route path="/home" exact>
          <Home />
        </Route>
        <Route path="/profile" exact>
          <UserProfile />
        </Route>
        <Route path="/records" exact>
          <Records />
        </Route>
        <Route path="/access-control" exact>
          <AccessControl />
        </Route>
        {/* {!isSuccess && <Login loginError={isError} />}
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
    </Fragment>
          )} */}
      </Layout>
  );
};
export default App;
