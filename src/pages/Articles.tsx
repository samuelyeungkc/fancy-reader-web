import React from 'react';
import Typography from '@mui/material/Typography';
import SignInBox from '../components/SignInBox';
import { CircularProgress } from '@mui/material';

const Articles = () => {

  return (
    <SignInBox>
      <Typography variant={'h4'}>
        Articles
      </Typography>
      <CircularProgress />
    </SignInBox>
  );
};

export default Articles;
