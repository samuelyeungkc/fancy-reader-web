import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PATH } from '../constants/Path';
import SignIn from '../pages/SignIn';
import Root from '../Root';
import OAuth from '../pages/Oauth';
import Articles from '../pages/Articles';

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
      {
        path: PATH.ARTICLES,
        element: <Articles />,
      }
    ],
  },
]);

const Router = () => {
  return (
    <RouterProvider router={router}/>
  );
}

export default Router;
