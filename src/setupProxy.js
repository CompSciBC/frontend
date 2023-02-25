/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://bmgalb-1523887164.us-west-2.elb.amazonaws.com:8080',
      changeOrigin: true
    })
  );
  // if (process.env.REACT_APP_BUILD_ENV === 'prod') {
  //   app.use(
  //     createProxyMiddleware('/api', {
  //       target: 'http://bmgalb-1523887164.us-west-2.elb.amazonaws.com:8080',
  //       changeOrigin: true
  //     })
  //   );
  // } else {
  //   app.use(
  //     createProxyMiddleware('/api', {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true
  //     })
  //   );
  // }
  
};
