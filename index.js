import { Client } from "twitter-api-sdk";
import { BigQuery } from "@google-cloud/bigquery";

const { LOCAL, BEARER_TOKEN, BQ_CREDENTIALS } = process.env;

const options = LOCAL === 'true' ? { keyFilename: BQ_CREDENTIALS } : { credentials: JSON.parse(BQ_CREDENTIALS) };
const bigquery = new BigQuery(options);

const twitter = new Client(BEARER_TOKEN);

export async function main(req, res) {
  console.log(req);
  res.status(200).send("yay");
  return;
  if (!("query" in req)) {
    res.status(422).send("missing query");
  } else {
    let stream = undefined;
    try {
      stream = twitter.tweets.tweetsRecentSearch({
        query: `${req.query} lang:en -is:retweet -is:reply -is:quote is:verified`,
        "tweet.fields": ["created_at", "public_metrics", "author_id"],
      })
    } catch (e) {
      res.status(500).send(`failed to create tweet stream ${e.stack}`);
      return;
    }

    try {
      for await (const tweets of stream) {
        console.log(`adding ${tweets['data'].length} tweets`)
        const bqRes = await bigquery
          .dataset('tilde_data')
          .table('tweets')
          .insert(tweets['data'].map(({ created_at, ...data }) => ({
            ...data,
            created_at: created_at ? created_at.slice(0, -1) : undefined
          })))
        console.log(JSON.stringify(bqRes, null, 4))
      }
    } catch (e) {
      res.status(500).send(`an error occured while processing tweets ${JSON.stringify(e, null, 4)} ${e.stack}`);
      return;
    }
    res.status(200).send(`successfuly added tweets`);
  }
}
