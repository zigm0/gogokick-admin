import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
history.listen((location) => {
/*  window.ga('set', 'page', location.pathname + location.search);
  window.ga('send', 'pageview');*/

  window.gtag('config', 'UA-151267728-1', {
    'page_title':    document.title,
    'page_location': window.location.href,
    'page_path':     location.pathname
  });
});

export default history;
