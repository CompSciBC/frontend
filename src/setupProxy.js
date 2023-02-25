/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:8080',
      // target: 'http://bmgalb-1523887164.us-west-2.elb.amazonaws.com:8080',
      changeOrigin: true
    })
  );
};
