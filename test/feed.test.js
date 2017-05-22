'use strict';

/**
 * RSS feed wrapper tests
 * - /lib/feed.js
 */

require('./setup');

// Mock the interface of npm 'rss' package
let rssInstance;
let toLowerCase = () => 'rss';
const RSS = function (config) {
  rssInstance = { item: sinon.spy() };
  return rssInstance;
};

let Feed;

beforeEach(() => {
  module.exports.RSS = RSS;
  Feed = require('./../lib/feed');
});
afterEach(() => {
  delete module.exports.RSS;
  delete require.cache[require.resolve('./../lib/feed')];
  Feed = null;
});

describe('/lib/feed.js', () => {
  it('should return an RSS instance', () => {
    let feed = new Feed({}, {});
    assert.deepEqual(feed, rssInstance, 'feed is an instance of rss');
  });
  it('should add each given entry to feed', () => {
    let entries = [
      { test: 'test' },
      { title: 'abc' },
    ];
    let feed = new Feed({}, entries);
    assert.equal(rssInstance.item.callCount, entries.length);
    for (let i = 0; i < entries.length; i++) {
      assert.equal(rssInstance.item.getCall(i).args[0], entries[i]);
    }
  });
});
