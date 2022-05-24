import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClaimedResource } from "../actions/ResourceActions";
import { resourcesSelector, resourcesActions } from "../store/ResourcesSlice";
import NotFound from "./NotFound";
import Loading from "../components/Layout/Loading";
import JSONPretty from "react-json-pretty";
import { AppBar, Divider, Typography, Toolbar } from "@mui/material";
import { useLocation } from "react-router-dom";

const RecordDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { claimedResources, currentResourceBody, isFetchingResource } =
    useSelector(resourcesSelector);

  // Get recordId from location path name
  const recordId = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );

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
