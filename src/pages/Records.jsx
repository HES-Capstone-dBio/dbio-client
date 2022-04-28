import { Fragment } from "react";
import { Route } from "react-router-dom";
import RecordDetails from "./RecordDetails";

const Records = () => {
  return (
    <Fragment>
      <h2>Records pages</h2>
      <Route path="/records/:recordId">
        <RecordDetails />
      </Route>
    </Fragment>
  );
};

export default Records;
