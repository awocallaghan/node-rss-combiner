'use strict';

/**
 * RSS feed wrapper tests
 * - /lib/feed.js
 */

require('./setup');

module.exports.Q = require('q');
// Mock FeedParser + request
const FeedParser = null;
const request = null;

let parseFeed;

beforeEach(() => {
  module.exports.FeedParser = FeedParser;
  module.exports.request = request;
  parseFeed = require('./../lib/parse-feed');
});
afterEach(() => {
  delete module.exports.FeedParser;
  delete module.exports.request;
  delete require.cache[require.resolve('./../lib/parse-feed')];
  parseFeed = null;
});
