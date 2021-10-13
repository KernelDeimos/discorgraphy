import { BootPhase } from "./chatbots/botapi";
import { DiscordBot } from "./chatbots/discord/discord";
import { container } from "./inversify.config";
import { TYPES } from "./types";

function main() {
    let bot = container.get<DiscordBot>(TYPES.DiscordBot);
    bot.onPhase(BootPhase.START_CHATBOT_CLIENTS);
}

main();