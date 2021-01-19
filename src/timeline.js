import Twitter from 'twitter';

export const Timeline = {
  name: '',
  client: new Twitter({
    consumer_key       : process.env['TWITTER_CONSUMER_KEY'],
    consumer_secret    : process.env['TWITTER_CONSUMER_SECRET'],
    access_token_key   : process.env['TWITTER_ACCESS_TOKEN'],
    access_token_secret: process.env['TWITTER_ACCESS_TOKEN_SECRET']
  }),
  tweets: [],
  async fetch() {
    const tweets = [];
    let maxID;

    for(;;) {
      let page = await this.client.get('statuses/user_timeline', {
        screen_name: this.name,
        count: 200,
        max_id: maxID,
        include_rts: false
      });

      if (maxID) page = page.shift();

      if (!page.length) break;

      maxID = page.slice(-1)[0].id_str;
      tweets.push(...page);
    }

    return tweets;
  },
  async update() {
    this.tweets = await this.fetch();
  },
  choice() {
    return this.tweets[Math.floor(Math.random() * this.tweets.length)];
  }
}
