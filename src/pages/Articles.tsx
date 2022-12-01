import React from 'react';

const Articles = () => {
  return (
    <>
      {[...new Array(120)].map((i, index) => <div key={Math.random()}>Articles here</div>)}
    </>
  );
};

export default Articles;
