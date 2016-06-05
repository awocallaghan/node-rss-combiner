rss-combiner [![Build Status](https://travis-ci.org/awocallaghan/node-rss-combiner.svg?branch=master)](https://travis-ci.org/awocallaghan/node-rss-combiner)
======

Combine multiple RSS feeds into one using [node-feedparser](https://www.npmjs.com/package/node-feedparser "npm node-feedparser package") and [rss](https://www.npmjs.com/package/rss "npm rss package").

    npm install rss-combiner

### Usage

#### Combine feeds

```js
var RSSCombiner = require('rss-combiner');

// Promise usage
RSSCombiner(feedConfig)
  .then(function (combinedFeed) {
    var xml = combinedFeed.xml();
  });

// Node callback usage
RSSCombiner(feedConfig, function (err, combinedFeed) {
  if (err) {
    console.error(err);
  } else {
    var xml = combinedFeed.xml();
  }
});
```

##### `feedOptions`

See [rss](https://www.npmjs.com/package/rss#feedoptions "feedOptions - rss (npm)") `feedOptions`

Additional options

* `size` **int** the maximum number of entries to keep (most recently published will be kept)
* `feeds` **array url string** array of feed_urls to retrieve content from
* `softFail` _optional_ **boolean** if true failing to retrieve a single feed will not result in an error being thrown (default value: false)

##### Example `feedOptions`

Creates a new feed with a maximum of 20 entries containing the latest entries from
2 RSS feeds.

```js
var feedConfig = {
  title: 'Tech news from Guardian and BBC',
  size: 20,
  feeds: [
    'http://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://www.theguardian.com/uk/technology/rss'
  ],
  pubDate: new Date()
};
```