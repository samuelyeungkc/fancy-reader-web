import React, { createContext, useContext } from 'react';
import { tags } from '../constants/ArticleStates';

export const ArticleListContext = createContext({
  selectedTag: tags.ALL,
});

export const useArticleListContext = () => useContext(ArticleListContext);
