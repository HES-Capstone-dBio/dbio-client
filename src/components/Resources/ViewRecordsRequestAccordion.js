import { Accordion } from "react-bootstrap";
import * as React from "react";
import ViewRecordsRequestTable from "./ViewRecordsRequestTable";

const ViewRecordsRequestAccordion = () => {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Open Requests</Accordion.Header>
        <Accordion.Body>
          <ViewRecordsRequestTable props={{includeButton:true}} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Accepted Requests</Accordion.Header>
        <Accordion.Body>
          <ViewRecordsRequestTable props={{includeButton:false}}/>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Rejected Requests</Accordion.Header>
        <Accordion.Body>
          <ViewRecordsRequestTable props={{includeButton:false}}/>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default ViewRecordsRequestAccordion;
