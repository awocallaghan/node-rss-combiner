'use strict';

/**
 * Class for creating an RSS feed
 * - Wrapper around 'rss' package
 */
var RSS = module.parent.exports.RSS;

function Feed (feedConfig, entries) {
  var newFeed = new RSS(feedConfig);
  for (var i = 0; i < entries.length; i++) {
    var thisEntry = entries[i];
    if (thisEntry.hasOwnProperty('link') && !thisEntry.hasOwnProperty('url')) thisEntry.url = thisEntry.link;
    if (thisEntry.hasOwnProperty('pubdate') && !thisEntry.hasOwnProperty('date')) thisEntry.date = thisEntry.pubdate;
    newFeed.item(thisEntry);
  }
  return newFeed;
}
Feed.constructor = Feed;

module.exports = Feed;
