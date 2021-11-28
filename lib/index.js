'use strict';

var _ = require('lodash');
var Q = require('q');
var FeedParser = require('feedparser');
var request = require('request');
var RSS = require('rss');

function getEntries(softFail, url) {
  var deferred = Q.defer();
  var fp = new FeedParser();
  var req = request(url);

  req.setMaxListeners(50);
  req.setHeader(
    'user-agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
  req.setHeader('accept', 'text/html,application/xhtml+xml');

  req.on('error', function (err) {
    if (softFail) {
      deferred.resolve(null);
    } else {
      deferred.reject(err);
    }
  });
  req.on('response', function (res) {
    if (res.statusCode !== 200) {
      var err = new Error('Bad response %d', res.statusCode);
      if (softFail) {
        deferred.resolve(null);
      } else {
        deferred.reject(err);
      }
    }
    req.pipe(fp);
  });

  fp.on('error', function (err) {
    if (!softFail) {
      deferred.reject(err);
    }
  });
  var items = [];
  fp.on('readable', function () {
    var stream = fp;
    var item;

    while ((item = stream.read())) {
      items.push(item);
    }
  });
  fp.on('end', function () {
    deferred.resolve(items);
  });

  return deferred.promise;
}

function sortEntries(entry) {
  if (entry) {
      var date = new Date(entry.pubdate);
      var time = date.getTime();
      return time * -1;
  } else {
      return null;
  }
}

function createFeed(feedConfig, entries) {
  var newFeed = new RSS(feedConfig);
  for (var i = 0; i < entries.length; i++) {
    var thisEntry = entries[i];
    var item = {
      title: thisEntry.title,
      description: thisEntry.description,
      url: thisEntry.link,
      guid: thisEntry.guid,
      categories: thisEntry.categories,
      author: thisEntry.author,
      date: thisEntry.pubdate
    };
    newFeed.item(item);
  }
  return newFeed;
}

function combine(feedConfig, callback) {
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
          return getEntries(feedConfig.softFail || false, feed);
        }))
      .then(_.flatten)
      .then(function (entries) { return _.sortBy(entries, sortEntries) })
      .then(function (entries) { return _.take(entries, feedConfig.size) })
      .then(function (entries) { return createFeed(strippedConfig, entries) })
      .then(function (createdFeed) { deferred.resolve(createdFeed) });

  } else {
    deferred.reject(err);
  }

  return deferred.promise;
}

module.exports = combine;
