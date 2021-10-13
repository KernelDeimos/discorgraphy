import { Client, Intents, Interaction, Message } from "discord.js";
import { inject } from "inversify";
import { BootPhase } from "../botapi";
import { TYPES } from "../../types";
import { TokenService } from "../../credentials/TokenService";


export const DISCORD_INTENTS = [
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
];

export class DiscordBot {
    private client: Client
    private tokenService: TokenService
    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.TokenService) tokenService: TokenService,
    ) {
        this.client = client;
        this.tokenService = tokenService;
    }
    onPhase(phase :BootPhase) {
        switch ( phase ) {
            case BootPhase.START_CHATBOT_CLIENTS:
                this.listen();
                break;
        }
    }
    async listen() {
        this.client.on(
            'messageCreate',
            this.handleMessage.bind(this),
        );
        await this.client.login(await this.tokenService.get('discord'));
    }
    handleMessage(message: Message): void {
        // TODO
        console.log('it works! ', message.toString());
    }
}