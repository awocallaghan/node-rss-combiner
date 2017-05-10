'use strict';

var _ = require('lodash');
var Q = require('q');

var Feed = require('./feed');
var parseFeed = require('./parse-feed');

/**
 * Main entry point to package
 */
function combine (feedConfig, callback) {
  var deferred = {};
  var err = null;
  if (callback) {
    deferred.resolve = function (feed) { callback(null, feed); }
    deferred.reject = function (err) { callback(err, null); }
  } else {
    deferred = Q.defer();
  }

  if (!feedConfig.feeds || feedConfig.feeds.length === 0 || !feedConfig.size) {
    err = new Error('Feeds and size are required feedConfig values');
  }

  if (err == null) {
    if (!feedConfig.generator) {
      feedConfig.generator = 'rss-combiner for Node';
    }

    if (!feedConfig.link) {
      feedConfig.link = 'https://www.npmjs.com/package/rss-combiner';
    }

    // Strip properties 'feeds' and 'size' from config to be passed to `rss` module
    var strippedConfig = {};
    for (var k in feedConfig) {
      if (k !== 'feeds' && k !== 'size') strippedConfig[k] = feedConfig[k];
    }

    Q
      .all(_.map(feedConfig.feeds, function (feed) {
          return parseFeed(feedConfig.softFail || false, feed);
        }))
      .then(_.flatten)
      .then(function (entries) { return _.sortBy(entries, sortEntries) })
      .then(function (entries) { return _.take(entries, feedConfig.size) })
      .then(function (entries) { return new Feed(strippedConfig, entries) })
      .then(function (createdFeed) { deferred.resolve(createdFeed) });

  } else {
    deferred.reject(err);
  }

  return deferred.promise;
}
module.exports = combine;


function sortEntries(entry) {
  if (entry) {
      var date = new Date(entry.pubdate);
      var time = date.getTime();
      return time * -1;
  } else {
      return null;
  }
}
