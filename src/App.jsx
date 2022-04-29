import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "./store/UserSlice";
import { initializeIroncoreSDK } from "./actions/UIActions";
import * as IronWeb from "@ironcorelabs/ironweb";
import Layout from "./components/Layout/Layout";
import { Route, Switch, Redirect } from "react-router-dom";
import Records from "./pages/Records";
import Home from "./pages/Home";
import AccessControl from "./pages/AccessControl";
import Landing from "./pages/Landing";
import ProtectedRoute from "./auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./components/Layout/Loading";

const App = () => {
  const { isFetching, isLoggedIn, isError, errorMessage } =
    useSelector(userSelector);

  const { isAuthenticated, isLoading, error, getIdTokenClaims, logout } =
    useAuth0();

  const dispatch = useDispatch();

  // Code to reinitialize ironcore sdk when page is refreshed.
  useEffect(() => {
    const getIdToken = async () => {
      return (await getIdTokenClaims()).__raw;
    };
    if (
      isAuthenticated &&
      !isLoading &&
      !IronWeb.isInitialized() &&
      isLoggedIn &&
      !isFetching
    ) {
      // Dispatch action to initialize ironcore SDK
      dispatch(initializeIroncoreSDK({ getIdToken }));
    }
  }, [
    isLoggedIn,
    isAuthenticated,
    isLoading,
    isFetching,
    dispatch,
    getIdTokenClaims,
  ]);

  if (isLoading || isFetching) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  } else if (isError || error) {
    logout({ returnTo: window.location.origin });
  }

  return (
    <Layout>
      <Switch>
        <Route exact path="/">
          {isAuthenticated ? <Redirect to="/home" /> : <Landing />}
        </Route>
        <ProtectedRoute path="/home" component={Home} />
        <ProtectedRoute path="/records" component={Records} />
        <ProtectedRoute path="/records/:recordId" component={Records} />
        <ProtectedRoute path="/access-control" component={AccessControl} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Layout>
  );
};
export default App;
