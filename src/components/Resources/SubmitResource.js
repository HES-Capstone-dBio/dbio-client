// @flow
import { Form, Button, Container } from "react-bootstrap";
import * as React from "react";

const SubmitResource = () => {
  return (
    <>
      <Container>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Paste body of the resource </Form.Label>
            <Form.Label>Text here</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ paddingBottom: 28 }}>
            Store Record
          </Button>
        </Form>
      </Container>
    </>
  )
}

export default SubmitResource;
