import React from 'react';
import Container from '@mui/material/Container/Container';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { WIDTH } from '../constants/Screens';

type Props = {
  children: JSX.Element[];
}

const SignInBox = ({ children }: Props) => {

  const isMobile = useMediaQuery(`(max-width:${WIDTH.sm}px)`);

  return (
    <Container
      component={'main'}
      maxWidth={'xs'}
      sx={{
        height: '100vh',
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Paper
        elevation={isMobile ? 0 : 16}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: isMobile ? '60%' : '400px',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 'auto',
          py: 10,
          px: 4,
          width: '100%'
        }}
        component={'section'}
      >
        {children}
      </Paper>
    </Container>
  );
};

export default SignInBox;
