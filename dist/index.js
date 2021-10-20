"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environments_1 = require("./environments");
const discord_js_1 = require("discord.js");
const lottery_1 = require("./lottery");
const responder_1 = require("./responder");
const broadcaster_1 = require("./broadcaster");
const bot = new discord_js_1.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
    makeCache: discord_js_1.Options.cacheWithLimits({ MessageManager: 0 }),
    presence: {
        activities: [
            { name: environments_1.ACTIVITY_STREAMING_NAME, type: 'STREAMING', url: environments_1.ACTIVITY_STREAMING_URL },
        ],
    },
});
bot.once('ready', bot => {
    lottery_1.Lottery.initialize();
    broadcaster_1.Broadcaster.initialize(bot, lottery_1.Lottery.pickTweetURL);
    responder_1.Responder.initialize(bot, lottery_1.Lottery.pickTweetURL);
    console.info('Everyday Kataribe (re)logged in to Discord.');
});
bot.login(environments_1.EVERYDAY_KATARIBE_TOKEN)
    .catch(console.error);
['SIGTERM', 'SIGINT']
    .forEach(signal => process.on(signal, () => {
    bot.destroy();
    process.exit(0);
}));
