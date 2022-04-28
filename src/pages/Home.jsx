import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../actions/UserActions";
import { userSelector } from "../store/UserSlice";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const dispatch = useDispatch();

  const { isLoggedIn, isFetching, isError } = useSelector(userSelector);

  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    // If user is authenticated but not logged in then dispatch login
    if (isAuthenticated && !isLoggedIn && !isFetching && !isError) {
      dispatch(loginUser({ user, getIdTokenClaims }));
    }
  }, [
    dispatch,
    isAuthenticated,
    isLoggedIn,
    isFetching,
    isError,
    getIdTokenClaims,
    user,
  ]);

  return <h2>Welcome home</h2>;
};
export default Home;
