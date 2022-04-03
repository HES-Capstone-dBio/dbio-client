import React, { useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Home.module.css';
import AuthContext from '../../store/AuthContext';
import SubmitResource from '../Resources/SubmitResource';
import ViewRecordsRequest from '../Resources/ViewRecordsRequest';

const Home = (props) => {
  const ctx = useContext(AuthContext);

  return (
    <Card className={classes.home}>
      {ctx.createResource && <SubmitResource/>}
      {!ctx.createResource && <ViewRecordsRequest/>}
    </Card>
  );
};

export default Home;
