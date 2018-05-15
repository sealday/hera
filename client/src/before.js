import Raven from 'raven-js';
if (process.env.NODE_ENV !== 'development') {
  Raven.config('http://0b212a63e44a4ec4a070b0a3babc4576@sentry.shchuangxing.com/2').install();
}
