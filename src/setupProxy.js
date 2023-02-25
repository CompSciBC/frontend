/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  let url = 'http://localhost:8080';
  if (process.env.REACT_APP_BUILD_ENV === 'prod') {
    url = 'http://bmgalb-1523887164.us-west-2.elb.amazonaws.com:8080';
  }
  app.use(
    createProxyMiddleware('/api', {
      target: url,
      changeOrigin: true
    })
  );
};
