import { Button, Table } from "react-bootstrap";
import * as React from "react";

/*****
* Claim Ownership - Table
*****/
const ViewRecordsRequestTable = ({props}) => {

  if (props.includeButton){
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Requestor ID</th>
          <th>How will the resource be used?</th>
          <th>Accept Request</th>
          <th>Reject Request</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ID0001</td>
          <td>Requesting access to my family member's medical data</td>
          <td>
            <Button variant="success" className="mb-2">Accept</Button>{' '}
          </td>
          <td>            
            <Button variant="warning" className="mb-2">Reject</Button>{' '}
          </td>
        </tr>
        <tr>
          <td>ID0002</td>
          <td>Requesting access for your doctor's appointment at UW hospital</td>
          <td>
            <Button variant="success" className="mb-2">Accept</Button>{' '}
          </td>
          <td>            
            <Button variant="warning" className="mb-2">Reject</Button>{' '}
          </td>
        </tr>
      </tbody>
    </Table>
  );
  }
  else {
    return(
    <Table striped bordered hover>
    <thead>
      <tr>
        <th>Requestor ID</th>
        <th>How will the resource be used?</th>
        <th>Modify Request</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ID0001</td>
        <td>Requesting access to my family member's medical data</td>
        <td>
        <Button variant="primary" className="mb-2">Modify</Button>{' '}
        </td>

      </tr>
      <tr>
        <td>ID0002</td>
        <td>Requesting access for your doctor's appointment at UW hospital</td>
        <td>
          <Button variant="primary" className="mb-2">Modify</Button>{' '}
        </td>
      </tr>
    </tbody>
  </Table>
    );
  }
}
export default ViewRecordsRequestTable;
