export const PATH = {
  SIGNIN: 'signin',
  OAUTH: 'oauth',
  ARTICLES: 'articles'
};

export const LANDING_PAGES_PATH = [
  '/',
  `/${PATH.SIGNIN}`,
  `/${PATH.OAUTH}`
];

const BASE_DOMAIN = 'https://getpocket.com';
const START_AUTH = '/auth/authorize';

export const POCKET = {
  START_AUTH: `${BASE_DOMAIN}${START_AUTH}`
};

export const PARAM_NAMES = {
  requestToken: 'request_token'
};
