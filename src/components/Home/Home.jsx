import React, { useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Home.module.css';
import AuthContext from '../../store/AuthContext';
import SubmitResource from '../Resources/SubmitResource';
import ViewRecordsRequest from '../Resources/ViewRecordsRequest';
import ResourceList from '../Resources/ResourceList';

const Home = (props) => {
  const ctx = useContext(AuthContext);

  return (
    <React.Fragment>
    <Card className={classes.home}>
      {ctx.createResource && <SubmitResource/>}
      {!ctx.createResource && <ViewRecordsRequest/>}
    </Card>
    <Card className={classes["resource-list"]}>
      {ctx.createResource && <ResourceList/>}
    </Card>
    </React.Fragment>
  );
};

export default Home;
