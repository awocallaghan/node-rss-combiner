'use strict';

/**
 * Parse an RSS feed using 'feedparser' package
 */

var Q = module.parent.exports.Q;
var FeedParser = module.parent.exports.FeedParser;
var request = module.parent.exports.request;

function parseFeed (softFail, url) {
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
module.exports = parseFeed;
