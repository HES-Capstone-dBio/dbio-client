import { Form, Button, Container, Spinner } from "react-bootstrap";
import React, { useReducer } from "react";
import { useDispatch } from "react-redux";
import { createResource } from "../../actions/ResourceActions";
import showSnackbar from "../UI/Snackbar/Snackbar";
import classes from "./SubmitResource.module.css";

const newResourceReducer = (state, action) => {
  if (action.type === "USER_INPUT_BODY") {
    return {
      title: state.title,
      body: action.val,
      savingResource: false,
    };
  } else if (action.type === "USER_INPUT_TITLE") {
    return {
      title: action.val,
      body: state.body,
      savingResource: false,
    };
  } else if (action.type === "SAVING_RESOURCE") {
    return {
      title: "",
      body: "",
      savingResource: true,
    };
  }
  return {
    title: "",
    body: "",
    savingResource: false,
  };
};

const SubmitResource = () => {
  const [resourceState, dispatchResource] = useReducer(newResourceReducer, {
    title: "",
    body: "",
    savingResource: false,
  });

  const dispatch = useDispatch();

  const resourceBodyHandler = (event) => {
    dispatchResource({ type: "USER_INPUT_BODY", val: event.target.value });
  };

  const resourceTitleHandler = (event) => {
    dispatchResource({ type: "USER_INPUT_TITLE", val: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const saving = resourceState.savingResource;
    const title = resourceState.title.trim();
    const body = resourceState.body.trim();

    // Check if we are currently saving a resource
    if (saving) {
      showSnackbar("Currently saving a resource, please wait..", "error");
      return;
    } else if (!title) {
      showSnackbar("Please enter a title for the resource", "error");
      return;
    } else if (!body) {
      showSnackbar("Please enter a body for the resource", "error");
      return;
    }

    // Update the saving resource state
    dispatchResource({ type: "SAVING_RESOURCE" });

    // Dispatch new resource to create
    dispatch(
      createResource(
        title,
        body,
        () => {
          dispatchResource({});
          showSnackbar("New resource created successfully");
        },
        () => {
          dispatchResource({});
        }
      )
    );
  };

  return (
    <Container>
      <Form onSubmit={submitHandler}>
        <Form.Group className={classes["mb-3"]}>
          <Form.Label className="mb-1">Resource Title </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Resource Title.."
            onChange={resourceTitleHandler}
            value={resourceState.title}
          />
          <Form.Label className="mt-3 mb-1">Resource Body</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter Resource Text..."
            onChange={resourceBodyHandler}
            value={resourceState.body}
          />
        </Form.Group>
        <Button className="mt-3" variant="primary" type="submit">
          {resourceState.savingResource && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            ></Spinner>
          )}
          Store Record
        </Button>
      </Form>
    </Container>
  );
};

export default SubmitResource;
