const SIGNIN = 'signin';
const OAUTH = 'oauth';
const ARTICLES = 'articles';
const MAIN = 'main';
const LISTEN = 'listen';

export const PATH = {
  SIGNIN: SIGNIN,
  OAUTH: OAUTH,
  MAIN: MAIN,
  ARTICLES: `${MAIN}/${ARTICLES}`,
  LISTEN: `${MAIN}/${ARTICLES}/${LISTEN}`,
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
