'use strict';

/**
 * Class for creating an RSS feed
 * - Wrapper around 'rss' package
 */
var RSS = require('rss');

function Feed (feedConfig, entries) {
  var newFeed = new RSS(feedConfig);
  for (var i = 0; i < entries.length; i++) {
    var thisEntry = entries[i];
    var item = {
      title: thisEntry.title,
      description: thisEntry.title,
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
Feed.constructor = Feed;

module.exports = Feed;
