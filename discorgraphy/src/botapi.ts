// API for connecting bots to Discorgraphy

enum BootPhase {
    START_CHATBOT_CLIENTS,
    READY,
}

interface BotClient {
    onPhase: (phase: BootPhase) => void
}