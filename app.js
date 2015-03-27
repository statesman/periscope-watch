var Twit = require('twit'),
    Slack = require('slack-node'),
    util = require('util');


/*~ Setup Twitter and Slack API instances ~*/

var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var slack = new Slack();
slack.setWebhook(process.env.SLACK_URL);


/*~ Fire up the stream and post to Slack when someone periscopes ~*/

var list = process.env.TWITTER_LIST.split('/');

T.get('lists/members', {
  owner_screen_name: list[0],
  slug: list[1],
  count: 5000, // The max for this endpoint and for streaming endpoint
  include_entities: false,
  skip_status: false
}, function(err, data) {
  if(err) return console.error(err);

  // Get a list of user IDs to create a stream from
  var members = data.users.map(function(member) {
    return member.id;
  });

  T.stream('statuses/filter', { follow: members }).on('tweet', handleTweet);
});

function handleTweet(tweet) {
  // Don't handle retweets or tweets w/o links
  if(tweet.retweeted_status || tweet.entities.urls.length === 0) return;

  // Ignore non-periscope tweets
  if(tweet.entities.urls[0].expanded_url.indexOf('periscope.tv/w/') === -1) return;

  // Push the tweet to Slack
  slack.webhook({
    channel: '#periscope',
    username: 'Periscope Watch',
    text: util.format('%s is streaming live on Periscope: %s', tweet.user.name, tweet.entities.urls[0].expanded_url)
  }, function(err, response) {
    if(err) return console.error(err);
  });
}


/*~ A really generic page to tell people to go away ~*/

require('http').createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Nothing to see here.\n');
}).listen(process.env.PORT);
