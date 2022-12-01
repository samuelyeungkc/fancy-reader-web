import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { PARAM_NAMES } from '../constants/Path';
import SignInBox from '../components/SignInBox';
import CircularProgress  from '@mui/material/CircularProgress';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

type OAuthContinueResponse = {
  accessToken: string;
  valid: boolean;
}

const OAuth = () => {

  const [urlParams] = useSearchParams();
  const token = urlParams.get(PARAM_NAMES.requestToken);
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const { setAccessToken } = useUser();

  useEffect(() => {
    const fetchAccessToken = (signal: AbortSignal) => {
      setErrorText('');
      fetch(
        `https://apps.samykc.com/pocket/auth/continue?request_token=${token}`,
        { signal }
      )
        .then(res => {
          if (!res.ok) {
            throw res.text();
          }
          return res.json();
        })
        .then((res: OAuthContinueResponse) => {
          if (!res.valid) {
            throw res;
          }
          setAccessToken(res.accessToken);
        })
        .catch(err => {
          if (err.name === 'AbortError') {
            console.log('aborted');
            return;
          }
          setErrorText(JSON.stringify(err));
          console.error(err);
        });
    };

    const abortController = new AbortController();
    fetchAccessToken(abortController.signal);
    return () => abortController.abort();
  }, [token, navigate, setAccessToken]);

  return (
    <SignInBox>
      <Typography variant={'h4'}>
        Authenticating
      </Typography>
      <CircularProgress />
      <Typography>
        {errorText}
      </Typography>
    </SignInBox>
  );
};

export default OAuth;
