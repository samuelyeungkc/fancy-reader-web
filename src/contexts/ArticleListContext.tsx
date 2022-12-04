import React, { createContext, useContext } from 'react';
import { tags } from '../constants/ArticleStates';
import { Article } from '../types/Article';

type ArticleListContextType = {
  selectedTag: string;
  articles: Article[];
  setArticles: (articles: Article[] | ((s: Article[]) => Article[])) => void;
};

export const ArticleListContext = createContext<ArticleListContextType>({
  selectedTag: tags.ALL,
  articles: [],
  setArticles: () => {},
});

export const useArticleListContext = () => useContext(ArticleListContext);
