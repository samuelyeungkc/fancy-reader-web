import React from 'react';
import { Outlet } from 'react-router-dom';
import Articles from './Articles';

const MainArticleListTab = () => {
  return (
    <>
      <Outlet />
      <Articles showNonArticleAltStyle={true}/>
    </>
  );
};

export default MainArticleListTab;
