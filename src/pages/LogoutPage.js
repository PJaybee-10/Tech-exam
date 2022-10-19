import React, { useContext, useEffect } from 'react';
import FeaturePage from 'components/FeaturePage';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import constants from '../constants';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function LogoutPage() {
  const { unsetUser } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    unsetUser();
    history.push('/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FeaturePage>
      <h2 className="mb-4">{constants.messages.BYE_HEADING} </h2>
      <p>{constants.messages.BYE_MESSAGE}</p>
      <p>
        <b>{constants.messages.IN_CASE_YOU_MISSED}: </b>
      </p>
      <Link to="/promos" className="btn btn-warning  rounded-0 mb-4">
        {constants.messages.BROWSE_PROMOS}
      </Link>
    </FeaturePage>
  );
}
