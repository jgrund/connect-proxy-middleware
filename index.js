module.exports = function proxyMiddleware(proxies) {
  'use strict';

  return function (req, resp, next) {
    var url = req.url;

    // Find a matching path and proxy to it.
    var matched = Object.keys(proxies).some(function (value) {
      var match = url.match(new RegExp(value));

      if (match !== null) {
        proxies[value](req, resp, next, match);
        return true;
      }

      return false;
    });

    // Continue if no paths matched.
    if (matched === false) {
      next();
    }
  };
};
