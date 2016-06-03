'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

const RSSCombiner = require('../lib');

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
  })
});
