import { strings, objects } from 'utils';

const paths = {
  home:               '/',
  city:               '/city/:name',
  community:          '/community/:name',
  communitySearch:    '/community/:name/search',
  lenderSearch:       '/lenders',
  newsArticle:        '/news/article/:id/:title',
  property:           '/property/:city/:address/:id',
  search:             '/search',
  login:              '/login',
  logout:             '/logout',
  account:            '/account',
  register:           '/register',
  password:           '/password',
  passwordReset:      '/resetting/reset/:token',
  contact:            '/contact',
  homeWorth:          '/home-worth',
  preApproved:        '/pre-approved',
  homeBuyingGuide:    '/home-buying-guide',
  homeSellingGuide:   '/home-selling-guide',
  mortgageRateTrends: '/mortgage/rates',
  matchMaker:         '/match-maker',
  privacy:            '/privacy',
  tou:                '/tou',
  about:              '/about'
};

/**
 * @param {string} name
 * @returns {string}
 */
export function path(name) {
  if (!paths[name]) {
    throw new Error(`Path ${name} not found.`);
  }
  return paths[name];
}

/**
 * @param {string} name
 * @param {*} params
 * @returns {string}
 */
export function route(name, params = {}) {
  let p = path(name);
  const remaining = {};

  Object.keys(params).forEach((key) => {
    const r = new RegExp(`:${key}`);
    if (p.match(r)) {
      p = p.replace(r, strings.encodeURI(params[key]));
    } else {
      remaining[key] = params[key];
    }
  });

  if (!objects.isEmpty(remaining)) {
    p = `${p}?`;
    Object.keys(remaining).forEach((key) => {
      p = `${p}${key}=${strings.encodeURI(remaining[key])}&`;
    });
    p = p.substring(0, p.length - 1);
  }

  return p;
}
