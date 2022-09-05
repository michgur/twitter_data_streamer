import { Client } from "twitter-api-sdk";
import { BigQuery } from "@google-cloud/bigquery";

const { BEARER_TOKEN, BQ_CREDENTIALS } = process.env;

const twitter = new Client(BEARER_TOKEN);

const bigquery = new BigQuery({
  credentials: JSON.parse(BQ_CREDENTIALS)
});

export async function main(req, res) {
  const stream = twitter.tweets.tweetsRecentSearch({
    query: "bananas lang:en -is:retweet -is:reply -is:quote is:verified",
    "tweet.fields": ["created_at", "public_metrics", "author_id"],
  })

  for await (const tweet of stream) {
    console.log(tweet);
    await bigquery.dataset('tilde_data').table('tweets').insert([tweet])
    res.status(200).send(`Started Successfuly ${tweet}`);
  }
}
