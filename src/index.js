import { Client } from "twitter-api-sdk";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = new Client(process.env.BEARER_TOKEN);
  await client.tweets.addOrDeleteRules(
    {
      add: [
        {
          value: "context:165.* lang:en -is:retweet -is:reply -is:quote is:verified",
          tag: "default"
        },
      ],
    }
  );
  const rules = await client.tweets.getRules();
  console.log(rules);
  const stream = client.tweets.searchStream({
    "tweet.fields": ["created_at", "public_metrics"],
  });
  for await (const tweet of stream) {
    console.log(tweet);
  }
}

main();
