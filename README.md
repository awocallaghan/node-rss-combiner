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

Plus 2 additional required options:

* `size` **int** the maximum number of entries to keep (most recently published will be kept)
* `feeds` **array url string** array of feed_urls to retrieve content from
