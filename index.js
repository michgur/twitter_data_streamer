import { Client } from "twitter-api-sdk";
import { BigQuery } from "@google-cloud/bigquery";
import dotenv from "dotenv";

dotenv.config();

const { LOCAL, BEARER_TOKEN, BQ_CREDENTIALS } = process.env;

const options = LOCAL ? { keyFilename: BQ_CREDENTIALS } : { credentials: JSON.parse(BQ_CREDENTIALS) };
const bigquery = new BigQuery(options);

const twitter = new Client(BEARER_TOKEN);

export async function main(req, res) {
  const stream = twitter.tweets.tweetsRecentSearch({
    query: "bananas lang:en -is:retweet -is:reply -is:quote is:verified",
    "tweet.fields": ["created_at", "public_metrics", "author_id"],
  })

  for await (const tweets of stream) {
    console.log(tweets);
    await bigquery
      .dataset('tilde_data')
      .table('tweets')
      .insert(tweets['data'].map(({ created_at, ...data }) => ({
        ...data,
        created_at: created_at ? created_at.slice(0, -1) : undefined
      })))
    }
  res.status(200).send(`Successfuly Added Tweets`);
}

main();
