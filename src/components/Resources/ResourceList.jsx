import React, { useState, useEffect } from "react";
import { listResources, getResource } from "../../actions/ResourceActions";
import { Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import classes from "./ResourceList.module.css";
import Paper from "../UI/Paper/Paper";

const ResourceList = () => {
  const resources = useSelector((state) => state.resources);
  const [expandedRow, setExpandedRow] = useState("");
  const [loadingRow, setLoadingRow] = useState(false);

  const dispatch = useDispatch();

  // // On initial page load get all resources that belong to this user
  useEffect(() => {
    dispatch(
      listResources(
        () => {},
        () => {}
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (expandedRow && typeof resources[expandedRow].body === "string") {
      setLoadingRow(null);
    }
  }, [expandedRow, resources]);

  /**
   * Conditionally return the resource body content depending on whether
   * the data needs to be loaded
   */
  const getResourceBody = (resource) => {
    if (expandedRow === null || expandedRow !== resource.id) {
      return null;
    }
    return <div className={classes["resource-body"]}>
      {loadingRow ? <Spinner animation="border" /> : resource.body}
    </div>
  }

  const expandRow = (resourceID) => {
    // If the user is collapsing this resource then clear out the expandRow state
    if (expandedRow === resourceID) {
      return setExpandedRow(null);
    }
    // If the data has already been loaded then display it
    if (typeof resources[resourceID].body === "string") {
      return setExpandedRow(resourceID);
    }
    // Otherwise set a loading indicator
    setExpandedRow(resourceID);
    setLoadingRow(true);
    dispatch(
      getResource(resourceID, () => {
        setExpandedRow(null);
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
      .slice().reverse().slice(0, 2);
    if (resourcesArray.length === 0) {
      return <h2>You currently have no records to display</h2>;
    }
    return resourcesArray.map((resource) => {
      return (
        <div key={resource.id} className={classes["resource-row"]} onClick={() => expandRow(resource.id)}>
          <div className={classes["resource-header"]}>
            <div className={classes["resource-title"]}>{resource.title}</div>
            <div className={classes.timestamp}>{new Date(resource.created).toLocaleTimeString()}</div>
          </div>
          {getResourceBody(resource)}
        </div>
      );
    });
  };

  return (
    <React.Fragment>
      <h3 className={classes["header-text"]}>Decrypt a resource:</h3>
      <Paper className={classes.paper}>{getGroupResources()}</Paper>
    </React.Fragment>
  );
};

export default ResourceList;
