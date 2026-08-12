module.exports.generatePrompt = (input, template) => {
    const systemInstruction = template.task 
        + "\n QUY TẮC BẮT BUỘC: " + template.rules.join("\n");

    const userPrompt = template.input
        .replace("{{spread}}", input.spread)
        .replace("{{cards}}", input.cards.join(" - "))
        .replace("{{question}}", input.question)
        + "\n" + template.others.join("\n");

    return {
        "system": systemInstruction,
        "user": userPrompt
    }
}