import React, { Fragment, useState, useEffect } from "react";
import { listResources, getResource } from "../../actions/ResourceActions";
import { useSelector, useDispatch } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { resourcesSelector } from "../../store/ResourcesSlice";
import showSnackbar from "../UI/Snackbar/Snackbar";

// Do not reinitiliaze when component renders again. Used
// as a flag for component's first render.
let isInitial = true;

const ResourceList = () => {
  const { resources, successCreatingResource, isError, errorMessage } =
    useSelector(resourcesSelector);
  const [expanded, setExpanded] = useState(null);
  const [loadingRow, setLoadingRow] = useState(false);

  const dispatch = useDispatch();

  // On initial page load get all resources that belong to this user
  useEffect(() => {
    dispatch(listResources());
  }, [dispatch]);

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }

    if (successCreatingResource) {
      dispatch(listResources());
    }
  }, [dispatch, successCreatingResource]);

  useEffect(() => {
    if (isError) {
      showSnackbar(errorMessage, "error");
    }
  }, [isError, errorMessage]);

  useEffect(() => {
    if (expanded && typeof resources[expanded].body === "string") {
      setLoadingRow(null);
    }
  }, [expanded, resources]);

  /**
   * Conditionally return the resource body content depending on whether
   * the data needs to be loaded
   */
  const getResourceBody = (resource) => {
    if (expanded === false || expanded !== resource.id) {
      return null;
    }
    return <Fragment>{loadingRow ? "" : resource.body}</Fragment>;
  };

  const handleChange = (resourceID) => (event, isExpanded) => {
    // If user is collapsing this resource then clear out the expanded state
    if (expanded === resourceID) {
      return setExpanded(null);
    }
    // If the data has already been loaded then display it
    if (typeof resources[resourceID].body === "string") {
      return setExpanded(resourceID);
    }
    // Otherwise set a loading indicator
    setExpanded(resourceID);
    setLoadingRow(true);
    dispatch(
      getResource({
        resourceID,
      })
    );
  };

  /**
   * Get a list of resources and display them as individual accordion items.
   */
  const getGroupResources = () => {
    const resourcesArray = Object.keys(resources)
      .map((resourceID) => resources[resourceID])
      .sort((a, b) => a.created > b.created)
      .slice()
      .reverse();
    if (resourcesArray.length === 0) {
      return <h2>You currently have no records to display</h2>;
    }
    return resourcesArray.map((resource) => {
      return (
        <Accordion
          key={resource.id}
          expanded={expanded === resource.id}
          onChange={handleChange(resource.id)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${resource.id}bh-content`}
            id={`${resource.id}bh-header`}
          >
            <Typography sx={{ width: "23%", flexShrink: 0 }}>
              {new Date(resource.created).toLocaleString()}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {resource.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{getResourceBody(resource)}</Typography>
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  return (
    <Fragment>
      <h3>Decrypt a resource:</h3>
      {getGroupResources()}
    </Fragment>
  );
};

export default ResourceList;
