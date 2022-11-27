import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import LoginIcon from '@mui/icons-material/Login';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { pink } from '@mui/material/colors';
import { WIDTH } from '../constants/Screens';

const SignIn = () => {

  const showBorder = useMediaQuery(`(min-width:${WIDTH.sm}px)`);

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
        elevation={showBorder ? 1 : 0}
        sx={{ my: 'auto', width: '100%' }}
        component={'section'}
      >
        <Box
          sx={{
            px: 3,
            py: 6,
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            display: 'flex'
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
            <LoginIcon />
          </Avatar>
          <Typography variant={'h5'} component={'h1'} gutterBottom>
            Authorize on Pocket
          </Typography>
          <Box
            sx={{ minWidth: '100%' }}
            component={'form'}
          >
            <Button
              fullWidth
              variant="contained"
            >
              Authorize
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
