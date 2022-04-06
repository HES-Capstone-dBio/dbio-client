import React, { useEffect } from "react";
import { listResources } from "../../actions/ResourceActions";
import { Container, Accordion } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

const ResourceList = () => {
  const resources = useSelector((state) => state.resources);
  const dispatch = useDispatch();

  // // On initial page load get all resources that belong to this user
  useEffect(() => {
    dispatch(listResources(() => {}, () => {}))
  }, [dispatch]);

  /**
   * Get a list of resources and display them as individual accordion items.
   */
  const getGroupResources = () => {

    const resourcesArray = Object.keys(resources)
      .map((resourceID) => resources[resourceID])
      .sort((a, b) => a.created > b.created);

    if (resourcesArray.length === 0) {
      return <h2>You currently have no records to display</h2>;
    }
    return resourcesArray.map((resource, index) => {
      return (
        <Accordion.Item key={resource.id} eventKey={index}>
          <Accordion.Header>
            {resource.title}
            {new Date(resource.created).toLocaleTimeString()}
          </Accordion.Header>
          <Accordion.Body>{resource.body}</Accordion.Body>
        </Accordion.Item>
      );
    });
  };

  return (
    <Container>
      <Accordion>{getGroupResources()}</Accordion>
    </Container>
  );
};

export default ResourceList;
