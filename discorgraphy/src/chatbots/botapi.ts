// API for connecting bots to Discorgraphy

export enum BootPhase {
    START_CHATBOT_CLIENTS,
    READY,
}

export interface BotClient {
    onPhase: (phase: BootPhase) => void
}