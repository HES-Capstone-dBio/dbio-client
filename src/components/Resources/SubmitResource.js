// @flow
import { Form, Button, Container } from "react-bootstrap";
import React, { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../store/AuthContext';

const SubmitResource = () => {
  const [resource, setResource] = React.useState(null);
  const [email, setEmail] = React.useState("test@test.com");

  const ctx = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    var data = JSON.stringify({
      "email": email,
      "creator_eth_address": "0xD070780172bD708173023623166CC9C88e2C57eb",
      "resource_type": "Patient",
      "resource_id": 29,
      "ciphertext": "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"
    });
    
    var config = {
      method: 'post',
      url: 'http://localhost:8080/dbio/resources',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }

  const handleResource = e => {
    e.preventDefault();
    setResource(e.target.value);
    //@TODO add logic to use Ironcore to transform input and add to the request
  }

  const handleEmail = e => {
    e.preventDefault();
    setEmail(e.target.value);
  }


  return (
    <>
      <Container>
        <Form onSubmit={e => { handleSubmit(e) }}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Resource Owner's Email Address </Form.Label>
            <Form.Label>Email Here</Form.Label>
            <Form.Control type="email" onChange={e => { handleEmail(e) }} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Paste body of the resource </Form.Label>
            <Form.Label>Text here</Form.Label>
            <Form.Control as="textarea" rows={3} onChange={e => { handleResource(e) }} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Store Record
          </Button>
        </Form>
      </Container>
    </>
  )
}

export default SubmitResource;
