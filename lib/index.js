'use strict';

const _ = require('lodash');
const Q = require('q');
const FeedParser = require('feedparser');
const request = require('request');
const RSS = require('rss');

function getEntries(url) {
  const deferred = Q.defer();
  const fp = new FeedParser();
  const req = request(url);

  req.setMaxListeners(50);
  req.setHeader(
    'user-agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
  req.setHeader('accept', 'text/html,application/xhtml+xml');

  req.on('error', (err) => {
    console.error(err);
    deferred.reject(err);
  });
  req.on('response', (res) => {
    if (res.statusCode !== 200) {
      const err = new Error('Bad response %d', res.statusCode);
      console.error(err);
      deferred.reject(err);
    }
    req.pipe(fp);
  });

  fp.on('error', (err) => {
    console.error(err);
    deferred.reject(err);
  });
  const items = [];
  fp.on('readable', () => {
    const stream = fp;
    let item;

    while ((item = stream.read())) {
      items.push(item);
    }
  });
  fp.on('end', () => {
    deferred.resolve(items);
  });

  return deferred.promise;
}

function sortEntries(entry) {
  const date = new Date(entry.pubdate);
  const time = date.getTime();
  return time * -1;
}

function createFeed(feedConfig, entries) {
  const newFeed = new RSS(feedConfig);
  for (let i = 0; i < entries.length; i++) {
    newFeed.item(entries[i]);
  }
  return newFeed;
}

function combine(feedConfig) {
  const deferred = Q.defer();
  let err = null;

  if (!feedConfig.feeds || feedConfig.feeds.length === 0 || !feedConfig.size) {
    err = new Error('Feeds and size are required feedConfig values');
  }

  if (err == null) {
    let strippedConfig = {};
    for (let k in feedConfig) {
      if (k !== 'feeds' && k !== 'size') strippedConfig[k] = feedConfig[k];
    }

    Q
      .all(_.map(feedConfig.feeds, getEntries))
      .then(_.flatten)
      .then(entries => _.sortBy(entries, sortEntries))
      .then(entries => _.take(entries, feedConfig.size))
      .then(entries => createFeed(strippedConfig, entries))
      .then(createdFeed => deferred.resolve(createdFeed));
  } else {
    deferred.reject(err);
  }

  return deferred.promise;
}

module.exports = combine;
