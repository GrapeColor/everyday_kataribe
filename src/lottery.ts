import { TWITTER_BEARER_TOKEN } from './environments';
import TwitterApi from 'twitter-api-v2';

import type { TweetV2, TwitterApiReadOnly } from 'twitter-api-v2';

export namespace Lottery {
  export function initialize(): void {
    const client = new TwitterApi(TWITTER_BEARER_TOKEN);

    cacheTweets(client.readOnly)
      .catch(console.error);
  }

  const twitterId = 'KataribeTsumugu';
  const tweets: TweetV2[] = [];

  async function cacheTweets(client: TwitterApiReadOnly): Promise<void> {
    const user = await client.v2.userByUsername(twitterId);
    const pagenator = await client.v2.userTimeline(user.data.id, { exclude: 'retweets' });

    await pagenator.fetchLast(1000)
    tweets.push(...pagenator);
  }

  export function pickTweetURL(): string {
    const index = Math.floor(Math.random() * tweets.length);
    const tweet = tweets[index];
    return `https://twitter.com/${twitterId}/status/${tweet.id}`;
  }
}
