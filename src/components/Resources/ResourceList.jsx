import React, { useState, useEffect } from "react";
import { listResources, getResource } from "../../actions/ResourceActions";
import { useSelector, useDispatch } from "react-redux";
import classes from "./ResourceList.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ResourceList = () => {
  const resources = useSelector((state) => state.resources);
  const [expanded, setExpanded] = useState(null);
  const [loadingRow, setLoadingRow] = useState(false);

  const dispatch = useDispatch();

  // On initial page load get all resources that belong to this user
  useEffect(() => {
    dispatch(
      listResources(
        () => {},
        () => {}
      )
    );
  }, [dispatch]);

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
    return <React.Fragment>{loadingRow ? "" : resource.body}</React.Fragment>;
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
      getResource(resourceID, () => {
        setExpanded(null);
        setLoadingRow(false);
      })
    );
  };

  /**
   * Get a list of resources and display them as individual accordion items.
   */
  // @TODO This array slicing and reversing is a temporary fix.
  const getGroupResources = () => {
    const resourcesArray = Object.keys(resources)
      .map((resourceID) => resources[resourceID])
      .sort((a, b) => a.created > b.created)
      .slice()
      .reverse()
      .slice(0, 2);
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
              {new Date(resource.created).toLocaleTimeString()}
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
    <React.Fragment>
      <h3 className={classes["header-text"]}>Decrypt a resource:</h3>
      {getGroupResources()}
    </React.Fragment>
  );
};

export default ResourceList;
