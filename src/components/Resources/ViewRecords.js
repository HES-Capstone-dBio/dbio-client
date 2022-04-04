import { Accordion } from "react-bootstrap";
import React, {useEffect, useState} from "react";
import ViewRecordsTable from "./ViewRecordsTable";
import axios from axios;

const ViewRecords = () => {

    const userEthAddress = "0xD070780172bD7081730236f0166CC9C88e2C57eb";

    useEffect( () => {
        axios.get("http://localhost:8080/resources"+ userEthAddress)        
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
    });


    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Jane Doe </Accordion.Header>
                <Accordion.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Resource Type</th>
                                <th>Resource ID</th>
                                <th>Link</th>
                                <th>Ownership Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Patient</td>
                                <td>P0001</td>
                                <td>www.ipfs.xxx/xxxx</td>
                                <td> <ClaimOwnershipButton /> </td>
                            </tr>
                        </tbody>
                    </Table>        
                    </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
export default ViewRecords;
