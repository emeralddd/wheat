const axios = require('axios');
const config = require('../config');
const { generatePrompt } = require('./promptGenerator');
require('dotenv').config({ path: 'secret.env' });

const tarotPromptTemplate = require('../assets/prompts/tarot');
const modelsList = config.MODELS;

module.exports.answer = async (t, question, cards) => {
    const prompt = generatePrompt({ spread: cards.length, cards, question }, tarotPromptTemplate);

    for (const modelName of modelsList) {
        try {
            const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: modelName,
                    messages: [
                        { role: "system", content: prompt.system },
                        { role: "user", content: prompt.user }
                    ],
                    temperature: config.AI_TEMPERATURE,
                    max_tokens: config.MAX_TOKENS_EACH_REQUEST,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API}`,
                        "HTTP-Referer": "https://wheatbot.xyz",
                        "X-Title": "Wheat Discord Bot",
                        "Content-Type": "application/json"
                    },
                    timeout: 25000
                }
            );

            const aiResponse = response.data.choices[0].message.content;

            // if (aiResponse.includes("system instruction")) {
            //     throw new Error("AI response contains system instruction, possible leak detected.");
            // }

            return aiResponse;
        } catch (error) {
            console.error(`Error in call AI API: ${modelName}:`, error.message);
            if (modelName === modelsList[modelsList.length - 1]) {
                return t("tarot.AIAnswerError");
            }
        }
    }
}