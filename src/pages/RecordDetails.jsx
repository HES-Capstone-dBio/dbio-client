import { Fragment } from "react";
import { useParams } from "react-router-dom";

const RecordDetails = () => {
  const params = useParams();

  // Search for Record here
  const record = false;

  if (!record) {
    return <h2>No record found</h2>;
  }
  // Render the record with the passed in ID
  return (
    <Fragment>
      <h1>Record Details</h1>
      <p>{params.recordId}</p>
    </Fragment>
  );
};

export default RecordDetails;
