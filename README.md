# Persicope Watch

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

A simple Node.js app to watch a Twitter list and post a message to Slack whenever someone on that lists starts streaming on Periscope. Deploy to Heroku using the button above or set the environment variables specified in [app.json](app.json) to run anywhere else.

You'll need to create a Twitter API app to supply the Twitter API credentials and you'll need an incoming Slack webhook. The app uses the streaming API to listen for new Tweets and posts about anything from the list that has the Periscope URL in it.
