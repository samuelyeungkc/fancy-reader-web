import React from 'react';
import Typography from '@mui/material/Typography';
import { PARAM_NAMES } from '../constants/Path';
import SignInBox from '../components/SignInBox';
import { CircularProgress } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const OAuth = () => {

  const [urlParams] = useSearchParams();

  const fetchAccessToken = () => {
    const token = urlParams.get(PARAM_NAMES.requestToken);
    fetch(`https://apps.samykc.com/pocket/auth/continue?request_token=${token}`)
      .then(res => {
        if (!res.ok) {
          throw res.text();
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
      })
      .catch(err => {
        alert(JSON.stringify(err));
        console.error(err);
      });
  };

  return (
    <SignInBox>
      <Typography variant={'h4'}>
        Authenticating
      </Typography>
      <CircularProgress />
      <Typography>
        {/*{''} error text goes here*/}
      </Typography>
    </SignInBox>
  );
};

export default OAuth;
