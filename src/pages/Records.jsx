import { Route } from "react-router-dom";
import RecordDetails from "./RecordDetails";

const Records = () => {
  return (
      <Route path="/records/:recordId">
        <RecordDetails />
      </Route>
  );
};

export default Records;
