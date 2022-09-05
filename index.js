const { Client } from "twitter-api-sdk";
import dotenv from "dotenv";

dotenv.config();
const { BEARER_TOKEN } = process.env;

export function main(req, res) {
  const client = new Client(BEARER_TOKEN);
  const stream = client.tweets.tweetsRecentSearch({
    query: "bananas lang:en -is:retweet -is:reply -is:quote is:verified",
    "tweet.fields": ["created_at", "public_metrics", "author_id"],
  })

  for await (const tweet of stream) {
    console.log(tweet);
    res.status(200).send(`Started Successfuly ${tweet}`);
  }
}
