import { Form, Button, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createResource } from "../../actions/ResourceActions";
import showSnack from "../UI/Snackbar/Snackbar";

const SubmitResource = () => {
  const [newResource, setNewResource] = useState({
    resourceBody: "",
    savingResource: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {}, [newResource.savingResource]);

  const resourceTextHandler = (event) => {
    setNewResource({ resourceBody: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    // Check if we are currently in the process of saving a new resource
    // or if nothing has been entered into the text box.
    if (newResource.savingResource || !newResource.resourceBody.trim()) {
      return;
    }

    // Update the saving resource state
    setNewResource({ savingResource: true });

    // Dispatch new resource to create
    dispatch(
      createResource(
        newResource.resourceBody.trim(),
        () => {
          setNewResource({ resourceBody: "", savingResource: false });
          showSnack("New resource created successfully");
        },
        () => {
          setNewResource({ savingResource: false });
        }
      )
    );
  };

  return (
    <Container>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Paste body of the resource </Form.Label>
          <Form.Label>Text here</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            onChange={resourceTextHandler}
            value={newResource.resourceBody}
          />
        </Form.Group>
        <Button variant="primary" type="submit" style={{ paddingBottom: 28 }}>
          Store Record
        </Button>
      </Form>
    </Container>
  );
};

export default SubmitResource;
