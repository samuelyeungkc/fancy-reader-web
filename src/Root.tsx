import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { PATH } from "./constants/Path";
import { useUser } from './contexts/UserContext';

const Root = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('checking signin status')
    if (!isSignedIn && window.location.pathname !== `/${PATH.OAUTH}`) {
      navigate(`/${PATH.SIGNIN}`);
    }
  }, [isSignedIn, navigate]);

  return (
      <Outlet />
  );
}

export default Root;
