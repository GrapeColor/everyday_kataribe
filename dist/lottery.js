"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lottery = void 0;
const environments_1 = require("./environments");
const twitter_api_v2_1 = __importDefault(require("twitter-api-v2"));
var Lottery;
(function (Lottery) {
    function initialize() {
        const client = new twitter_api_v2_1.default(environments_1.TWITTER_BEARER_TOKEN);
        cacheTweets(client.readOnly)
            .catch(console.error);
    }
    Lottery.initialize = initialize;
    const twitterId = 'KataribeTsumugu';
    const tweets = [];
    async function cacheTweets(client) {
        const user = await client.v2.userByUsername(twitterId);
        const pagenator = await client.v2.userTimeline(user.data.id, { exclude: 'retweets' });
        await pagenator.fetchLast(1000);
        tweets.push(...pagenator);
    }
    function pickTweetURL() {
        const index = Math.floor(Math.random() * tweets.length);
        const tweet = tweets[index];
        return `https://twitter.com/${twitterId}/status/${tweet.id}`;
    }
    Lottery.pickTweetURL = pickTweetURL;
})(Lottery = exports.Lottery || (exports.Lottery = {}));
