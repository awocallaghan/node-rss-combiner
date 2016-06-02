rss-combiner
======

Combine multiple RSS feeds into one using [node-feedparser](https://www.npmjs.com/package/node-feedparser) and [rss](https://www.npmjs.com/package/rss).

    npm install rss-combiner

### Usage

#### Combine feeds

```js
    var RSSCombiner = require('rss-combiner');

    RSSCombiner(feedConfig)
        .then(function (combinedFeed) {
            var xml = combinedFeed.xml();
        });
```

##### `feedOptions`

See [rss](https://www.npmjs.com/package/rss "RSS npm package") `feedConfig`

Plus 2 additional required options:

* `size` **int** the maximum number of entries to keep (most recently published will be kept)
* `feeds` **array url string** array of feed_urls to retrieve content from