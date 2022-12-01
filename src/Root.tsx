import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { LANDING_PAGES_PATH, PATH } from './constants/Path';
import { useUser } from './contexts/UserContext';

const getRedirectPath = (isSignedIn: boolean, currentPath: string) => {
  switch (true) {
    case !isSignedIn && currentPath !== `/${PATH.OAUTH}`:
      return `/${PATH.SIGNIN}`;
    case isSignedIn && LANDING_PAGES_PATH.includes(currentPath):
      return `/${PATH.ARTICLES}`;
    case isSignedIn && currentPath === `/${PATH.MAIN}`:
      return `/${PATH.ARTICLES}`;
  }
  return null;
};

const Root = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('checking signin status')
    const redirect = getRedirectPath(isSignedIn, window.location.pathname);
    if (redirect) {
      navigate(redirect);
    }
  }, [isSignedIn, navigate]);

  return (
      <Outlet />
  );
}

export default Root;
