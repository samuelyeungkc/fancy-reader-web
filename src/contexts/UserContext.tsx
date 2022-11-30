import React from 'react';
import { getCookie, setCookie } from '../utils/CookieUtils';
import { COOKIE_NAMES } from "../constants/Cookies";
import { DAYS_IN_YEAR } from '../constants/Times';

const UserContext = React.createContext({
  accessToken: '',
  setAccessToken: (_: string) => {}
});

export const useUser = () => {
  const userContext = React.useContext(UserContext);
  return {
    ...userContext,
    isSignedIn: userContext.accessToken.length > 0
  };
};

type Props = {
  children: JSX.Element;
};

const UserContextWrapper = ({ children }: Props) => {
  const [accessToken, setAccessToken] = React.useState(getCookie(COOKIE_NAMES.ACCESS_TOKEN));

  const updateContextAccessToken = (token: string) => {
    setCookie(COOKIE_NAMES.ACCESS_TOKEN, token, DAYS_IN_YEAR);
    setAccessToken(token);
  };

  return (
    <UserContext.Provider value={{accessToken, setAccessToken: updateContextAccessToken}}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextWrapper;
