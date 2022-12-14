import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PATH } from '../constants/Path';
import SignIn from '../pages/SignIn';
import Root from '../Root';
import OAuth from '../pages/Oauth';
import Main from '../pages/Main';
import ListenModalSheet from '../components/ListenModalSheet';
import MainArticleListTab from '../pages/MainArticleListTab';

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
        path: PATH.MAIN,
        element: <Main />,
        children: [
          {
            path: `/${PATH.ARTICLES}`,
            element: <MainArticleListTab />,
            children: [
              {
                path: `/${PATH.LISTEN}`,
                element: <ListenModalSheet />,
              }
            ]
          }
        ]
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
