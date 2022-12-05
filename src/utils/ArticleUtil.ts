import { Article } from '../types/Article';

export const getDomain = (article: Article) => {
  return article.domain_metadata?.name || getBaseDomain(article) || '';
};

const getBaseDomain = (article: Article) => {
  const fullDomain = article?.resolved_url.split('/')[2];
  return fullDomain?.replaceAll('www.', '').replaceAll('.com', '');
};
