'use strict';

/**
 * Main package tests
 * - /lib/index.js
 */

require('./setup');

let RSSCombiner;

beforeEach(() => {
  RSSCombiner = require('./../lib');
});
afterEach(() => {
  RSSCombiner = null;
  // Empty require cache
  delete require.cache[require.resolve('./../lib')];
  delete require.cache[require.resolve('./../lib/parse-feed')];
  delete require.cache[require.resolve('./../lib/feed')];
});

describe('RSSCombiner', function() {
  it('should reject invalid config', function() {
    const invalidConfigs = [
      {}, {size:'1'}, {size:null}, {size:'string'},
      {feeds: []}, {feeds:null}, {feeds:['http://someurl.com']}
    ];

    invalidConfigs
      .forEach(config => {
        assert.isRejected(
          RSSCombiner(config),
          'Invalid config should produce a reject error'
        );
      });
  });

  it('should produce a combined feed of correct size', function() {
    const configs = [
      {
        size:5,
        feeds: [
          'http://feeds.bbci.co.uk/news/rss.xml?edition=uk',
          'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'
        ]
      }
    ];

    configs
      .forEach(config => {
        return assert.isFulfilled(
          RSSCombiner(config),
          'Valid config should resolve a feed'
        );
      });
  });

  it('should use a callback function if given', function() {
    const config = {
      size:5,
      feeds: [
        'http://feeds.bbci.co.uk/news/rss.xml?edition=uk',
        'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'
      ]
    };

    RSSCombiner(config, (err, feed) => {
      assert.isNull(err);
      assert.isNotNull(feed);
    });
  });

  it('shouldn\'t fail if softFail set to true', function() {
    let config = {
      size: 5,
      feeds: [
        'http://feeds.bbci.co.uk/news/rss.xml?edition=uk',
        'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
        'http://example.com/fake.xml'
      ]
    };

    assert.isRejected(RSSCombiner(config), 'Should fail if no softFail config value');

    config.softFail = true;

    assert.isFulfilled(RSSCombiner(config));
  });
});
