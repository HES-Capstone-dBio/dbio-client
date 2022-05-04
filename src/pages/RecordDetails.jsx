import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClaimedResource } from "../actions/ResourceActions";
import { resourcesSelector, resourcesActions } from "../store/ResourcesSlice";
import NotFound from "./NotFound";

const RecordDetails = () => {
  const dispatch = useDispatch();
  const { claimedResources, currentResourceBody } =
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

  // Render the record with the passed in ID
  return (
    <Fragment>
      <h1>Record Details</h1>
      <p>{recordId}</p>
      <p>{currentResourceBody}</p>
    </Fragment>
  );
};

export default RecordDetails;
