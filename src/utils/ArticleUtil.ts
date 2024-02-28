import { Article } from '../types/Article';

export const getDomain = (article: Article) => {
  return article.domain_metadata?.name || getBaseDomain(article) || '';
};

export const getArtist = (article?: Article) => {
  if (article) {
    return article.domain_metadata?.name || getBaseDomain(article) || '';
  }
  return '';
};

const getBaseDomain = (article: Article) => {
  const url = article?.resolved_url ?? article?.given_url;
  const fullDomain = url.split('/')[2];
  return fullDomain?.replaceAll('www.', '').replaceAll('.com', '');
};
