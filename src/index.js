import Discord from 'discord.js';
import Twitter from 'twitter';

import cron from 'node-cron';

const schedule = '0 3,15 * * *';

// Initialize twitter client and data.
const twitter = new Twitter({
  consumer_key       : process.env['TWITTER_CONSUMER_KEY'],
  consumer_secret    : process.env['TWITTER_CONSUMER_SECRET'],
  access_token_key   : process.env['TWITTER_ACCESS_TOKEN'],
  access_token_secret: process.env['TWITTER_ACCESS_TOKEN_SECRET']
});

const twitterName = 'KataribeTsumugu';
let tweets;

const fetchTweets = async () => {
  tweets = [];
  let maxID;

  for(;;) {
    let section = await twitter.get('statuses/user_timeline', {
      screen_name: twitterName,
      count: 200,
      max_id: maxID,
      include_rts: false
    });

    if (maxID) section = section.shift();

    if (!section.length) break;

    maxID = section.slice(-1)[0].id_str;
    tweets.push(...section);
  }
}

fetchTweets()
  .catch(console.error);

// Initialize Discord client and events.
const bot = new Discord.Client({
  ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'] },
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  messageCacheMaxSize: 0
});

const sendTweet = channel => {
  const tweet = tweets[Math.floor(Math.random() * tweets.length)];

  channel.send(`https://twitter.com/${twitterName}/status/${tweet.id_str}`)
    .catch(console.error);
}

const sendTweetAll = () => channels.each(channel => sendTweet(channel));

cron.schedule(schedule, () => sendTweetAll(), { timezone: 'Asia/Tokyo' });

const targetRegex = /<まいにち語部>/;
let mentionRegex;

let channels;

bot.once('ready', () => {
  mentionRegex = new RegExp(`^<@!?${bot.user.id}>$`);

  channels
    = bot.channels.cache.filter(channel => targetRegex.test(channel.topic));
});

bot.on('ready', () => {
  bot.user?.setPresence({
    activity: {
      type: 'WATCHING',
      name: '語部紡',
    }
  })
    .catch(console.error);
});

bot.on('channelUpdate', (_, channel) => {
  targetRegex.test(channel.topic)
    ? channels.set(channel.id, channel) : channels.delete(channel.id);
});

bot.on('message', message => {
  if (mentionRegex.test(message.content)) sendTweet(message.channel);
});

bot.setInterval(() => {
  fetchTweets()
    .catch(console.error);
}, 24 * 60 * 60 * 1000);

bot.login(process.env['EVERYDAY_KATARIBE_TOKEN'])
  .then(console.info('Everyday Kataribe logged in to Discord.'))
  .catch(console.error);
