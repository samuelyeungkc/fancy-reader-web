import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import LoginIcon from '@mui/icons-material/Login';
import { pink } from '@mui/material/colors';
import { POCKET } from '../constants/Path';
import SignInBox from '../components/SignInBox';

type PocketAuthStartResponse = {
  uri: string;
  requestToken: string;
};

const SignIn = () => {

  const [loadingRequestToken, setLoadingRequestToken] = useState(false);

  const fetchRequestToken = () => {
    fetch('https://apps.samykc.com/pocket/auth/start')
      .then(res => {
        if (!res.ok) {
          throw res.text();
        }
        return res.json();
      })
      .then((res: PocketAuthStartResponse) => {
        const { requestToken } = res;
        const origin = window.location.origin;
        const url = `${POCKET.START_AUTH}?request_token=${requestToken}&redirect_uri=${origin}`;
        console.log(res, url);
        // window.location.href = res.uri;
      })
      .catch(err => {
        alert(JSON.stringify(err));
        console.error(err);
      });
  };

  const getButtonText = () => {
    return loadingRequestToken ? 'Loading' : 'Authorize';
  };

  useEffect(() => {
    if (loadingRequestToken) {
      fetchRequestToken();
    }
  }, [loadingRequestToken]);

  return (
    <SignInBox>
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexDirection: 'column'
        }}
      >
        <Avatar
          alt=""
          sx={{
            width: 56,
            height: 56,
            bgcolor: pink[500],
          }}
        >
          <LoginIcon/>
        </Avatar>
        <Typography variant={'h5'} component={'h1'} gutterBottom>
          Authorize on Pocket
        </Typography>
      </Container>

      <Box
        sx={{ minWidth: '100%' }}
        component={'form'}
      >
        <Button
          disabled={loadingRequestToken}
          fullWidth
          variant="contained"
          onClick={() => setLoadingRequestToken(true)}
        >
          {getButtonText()}
        </Button>
      </Box>
    </SignInBox>
  );
};

export default SignIn;
