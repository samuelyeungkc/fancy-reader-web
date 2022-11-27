import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PATH } from '../constants/Path';
import SignIn from '../pages/SignIn';
import Root from '../Root';
import OAuth from '../pages/Oauth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    children: [
      {
        path: PATH.SIGNIN,
        element: <SignIn/>,
      },
      {
        path: PATH.OAUTH,
        element: <OAuth />,
      },
    ],
  },
]);

const Router = () => {
  return (
    <RouterProvider router={router}/>
  );
}

export default Router;
