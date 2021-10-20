"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Responder = void 0;
var Responder;
(function (Responder) {
    function initialize(bot, contentGenerator) {
        bot.on('messageCreate', message => sendTweet(bot.user, message, contentGenerator));
    }
    Responder.initialize = initialize;
    function sendTweet(clientUser, message, contentGenerator) {
        const content = message.content;
        if (content !== clientUser.toString() && content !== `<@!${clientUser.id}>`)
            return;
        message.channel.send(contentGenerator())
            .catch(console.error);
    }
})(Responder = exports.Responder || (exports.Responder = {}));
