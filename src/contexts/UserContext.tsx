import React from 'react';
import { getCookie } from "../utils/CookieUtils";
import { COOKIE_NAMES } from "../constants/Cookies";

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
    document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=${token}`
    setAccessToken(token);
  };

  return (
    <UserContext.Provider value={{accessToken, setAccessToken: updateContextAccessToken}}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextWrapper;
