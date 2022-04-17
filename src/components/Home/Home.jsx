import React from "react";

import Card from "../UI/Card/Card";
import classes from "./Home.module.css";
import SubmitResource from "../Resources/SubmitResource";
import ViewRecordsRequest from "../Resources/ViewRecordsRequest";
import ResourceList from "../Resources/ResourceList";

const Home = (props) => {
  return (
    <React.Fragment>
      <Card className={classes.home}>
        <SubmitResource />
        <ViewRecordsRequest />
      </Card>
      <div className={classes["resource-list"]}>
        <ResourceList />
      </div>
    </React.Fragment>
  );
};

export default Home;
