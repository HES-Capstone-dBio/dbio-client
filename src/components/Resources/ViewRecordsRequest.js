import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import ViewRecordsRequestAccordion from "./ViewRecordsRequestAccordion"; 

const ViewRecordsRequest = () => {
  return (
    <>
      <div className="app">
        <Container >
        <h3>Grant Access To Your Records</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formText">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="text" placeholder="Email Address of the User To Whom You Want to Grant Access" />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ paddingBottom: 28, marginRight:20 }}>
            Grant Access
          </Button>
          <Button variant="warning" type="submit" style={{ paddingBottom: 28 }}>
            Revoke Access
          </Button>
        </Form>
          <hr />
          <h3>View Requests for your Records</h3>
          <h6>View, authorize, and reject 3rd party access requests for your medical records</h6>
          <ViewRecordsRequestAccordion />
        </Container>
      </div>
    </>
  );
}

export default ViewRecordsRequest;

