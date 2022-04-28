import React, { useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "./store/UserSlice";
import { initializeIroncoreSDK } from "./actions/UIActions";
import * as IronWeb from "@ironcorelabs/ironweb";
import Layout from "./components/Layout/Layout";
import { Route, Switch } from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import Records from "./pages/Records";
import Home from "./pages/Home";
import AccessControl from "./pages/AccessControl";
import Landing from "./pages/Landing";
import ProtectedRoute from "./auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { useAuth0 } from "@auth0/auth0-react";
import { clearUserState } from "./actions/UserActions";
import Loading from "./components/Layout/Loading";
import showSnackbar from "./components/UI/Snackbar/Snackbar";

const App = () => {
  const { isFetching, isLoggedIn, isError, errorMessage } =
    useSelector(userSelector);

  const { isLoading, error, getIdTokenClaims } = useAuth0();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      showSnackbar(errorMessage, "error");
      dispatch(clearUserState());
    } else if (isFetching) {
      return (
        <Layout>
          <Loading />
        </Layout>
      );
    }
  }, [isFetching, isError, error, errorMessage, dispatch]);

  // Code to reinitialize ironcore sdk when page is refreshed.
  useEffect(() => {
    const getIdToken = async () => {
      return (await getIdTokenClaims()).__raw;
    };
    if (!isLoading && !IronWeb.isInitialized() && isLoggedIn) {
      // Dispatch action to initialize ironcore SDK
      dispatch(initializeIroncoreSDK({ getIdToken }));
    }
  }, [isLoggedIn, isLoading, dispatch, getIdTokenClaims]);

  if (isLoading || isFetching) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  } else if (isError) {
    showSnackbar(errorMessage, "error");
    dispatch(clearUserState());
  } else if (error) {
    showSnackbar(error.message, "error");
  }

  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Landing} />
        <ProtectedRoute path="/home" component={Home} />
        <ProtectedRoute path="/profile" component={UserProfile} />
        <ProtectedRoute path="/records" component={Records} />
        <ProtectedRoute path="/records/:recordId" component={Records} />
        <ProtectedRoute path="/access-control" component={AccessControl} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Layout>
  );
};
export default App;
