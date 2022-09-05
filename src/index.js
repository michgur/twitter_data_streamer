import { Client } from "twitter-api-sdk";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const { PORT, BEARER_TOKEN } = process.env;

const app = express();

app.get('/', async (req, res) => {
  const client = new Client(BEARER_TOKEN);
  const stream = client.tweets.tweetsRecentSearch({
    query: "bananas lang:en -is:retweet -is:reply -is:quote is:verified",
    "tweet.fields": ["created_at", "public_metrics", "author_id"],
  })

  for await (const tweet of stream) {
    console.log(tweet);
    res.send(`Started Successfuly ${tweet}`);
  }
});

app.listen(PORT, () => {
  console.log(`helloworld: listening on port ${PORT}`);
});
