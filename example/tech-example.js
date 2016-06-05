//var RSSCombiner = require('rss-combiner');
var RSSCombiner = require('../lib');
var fs = require('fs');

var techFeedConfig = {
    size: 20,
    feeds: [
        'http://feeds.bbci.co.uk/news/technology/rss.xml', // BBC tech news
        'https://news.ycombinator.com/rss', // Hacker News
        'https://www.theguardian.com/uk/technology/rss', // Guardian tech news
        'http://www.engadget.com/rss.xml', // Engadget
    ],
    pubDate: new Date()
};

RSSCombiner(techFeedConfig)
    .then(function (feed) {
        var xml = feed.xml({ indent: true });
        fs.writeFile('example/xml/tech-example.xml', xml, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log('Tech feed written');
            }
        });
    });


