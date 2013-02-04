'use strict';

var proxy = require('../');
var sinon = require('sinon');
var assert = require('assert');

describe('The proxy', function () {
  var fn;
  var config;
  var spy;

  /**
   * Returns a request or response object, depending if any arguments were passed.
   * @returns {{url: String}|{}}
   */
  function getReqOrResp() {
    return (arguments.length ? {url: arguments[0]} : {});
  }

  function next() {}

  beforeEach(function () {
    spy = sinon.spy();

    config = [
      {
        matcher: /^foo\/bar/,
        handler: sinon.spy()
      },
      {
        matcher: '^/match/this',
        handler: sinon.spy()
      }
    ];

    fn = proxy(config);
  });

  it('should proxy a matching request', function () {
    var req = getReqOrResp('/foo/bar');
    var resp = getReqOrResp();
    var match = req.url.match(new RegExp('^/this/thing'));

    fn(req, resp, next);

    assert(spy.called);
    assert(spy.calledWith(req, resp, next, match));
  });

  it('should not proxy a non-matching request', function () {
    var req = {
      url: '/no/match'
    };

    var resp = {};
    function next() {}

    fn(req, resp, next);

    assert(spy.notCalled);
  });
});


