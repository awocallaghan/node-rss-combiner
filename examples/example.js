const rssCombiner = require('../combine');

const testFeedConfigData = {
  title: 'Example Combined RSS Feed',
  size: 20,
  feeds: [
    'http://feeds.bbci.co.uk/news/rss.xml?edition=uk',
    'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'
  ]
};

rssCombiner(testFeedConfigData)
  .then(combinedFeed => {
    console.log('Created RSS feed:');
    console.log('- Title: %s', combinedFeed.title);
    console.log('- Entries: %d', combinedFeed.items.length);
    console.log(combinedFeed.xml());
  });