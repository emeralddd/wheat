module.exports = {
    // AI Model
    MODELS: [
        "qwen/qwen3-next-80b-a3b-instruct:frees",
        "meta-llama/llama-3.3-70b-instruct:frees",
    ],
    MAX_TOKENS_EACH_REQUEST: 1000,
    AI_TEMPERATURE: 0.6,
    TAROT_AI_RATE: 60000, // 60 seconds
}