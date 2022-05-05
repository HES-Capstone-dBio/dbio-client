import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClaimedResource } from "../actions/ResourceActions";
import { resourcesSelector, resourcesActions } from "../store/ResourcesSlice";
import NotFound from "./NotFound";
import Loading from "../components/Layout/Loading";
import JSONPretty from "react-json-pretty";
import { AppBar, Divider, Typography, Toolbar } from "@mui/material";

const RecordDetails = () => {
  const dispatch = useDispatch();
  const { claimedResources, currentResourceBody, isFetchingResource } =
    useSelector(resourcesSelector);

  // @TODO Fix this, HACKY! This is a hacky way to get around using
  // a higher order ProtectedRoute component and not being able
  // to use the useParams hook to get record ID. I'm sure there's a
  // solution to this.
  const pathname = window.location.pathname;
  const recordId = pathname.substring(pathname.lastIndexOf("/") + 1);

  // Search for the record
  const claimedResource = claimedResources.find(
    (resource) => resource.id === recordId
  );

  useEffect(() => {
    if (!claimedResource) {
      return <NotFound />;
    }

    dispatch(
      getClaimedResource({
        id: claimedResource.id,
        resourceType: claimedResource.resourceType,
      })
    );

    return () => {
      dispatch(resourcesActions.clearCurrentResourceBody());
    };
  }, [claimedResource, dispatch]);

  if (isFetchingResource) {
    return <Loading />;
  }

  // Render the record with the passed in ID
  return (
    <Fragment>
      <AppBar position="static" sx={{ bgcolor: "rgba(69, 63, 181, 0.35)" }}>
        <Toolbar>
          <Typography fontSize="1.4rem" color="black" fontWeight="500">
            Record Details
          </Typography>{" "}
        </Toolbar>
      </AppBar>
      <Divider />
      <JSONPretty
        className="recordDetails"
        data={currentResourceBody}
        style={{ fontSize: "1.1em" }}
      />
    </Fragment>
  );
};

export default RecordDetails;
