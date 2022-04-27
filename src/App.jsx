// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { userSelector } from "./store/UserSlice";
// import { initializeIroncoreSDK } from "./actions/UIActions";
// import * as IronWeb from "@ironcorelabs/ironweb";
import Layout from "./components/Layout/Layout";
import { Route, Switch } from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import Records from "./pages/Records";
import Home from "./pages/Home";
import AccessControl from "./pages/AccessControl";
import Landing from "./pages/Landing";
import ProtectedRoute from "./auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const App = () => {
  // const { isLoggedIn, idToken, privateKey, isSuccess, isError } =
  //   useSelector(userSelector);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // Reinitialize IronCore SDK if the page is refreshed by
  //   // dispatching the initializeIroncoreSDK action
  //   if (!IronWeb.isInitialized() && isLoggedIn) {
  //     dispatch(initializeIroncoreSDK({ idToken, privateKey }));
  //   }
  // }, [dispatch, idToken, isLoggedIn, privateKey]);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/home" exact>
          <Home />
        </Route>
        <Route path="/profile" exact>
          <UserProfile />
        </Route>
        <Route path="/records" exact>
          {console.log("records path")}
          <Records />
        </Route>
        <Route path="/records/:recordId">
          <Records />
        </Route>
        <Route path="/access-control" exact>
          <AccessControl />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Layout>
  );
};
export default App;
