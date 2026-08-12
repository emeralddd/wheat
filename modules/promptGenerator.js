module.exports.generatePrompt = (input, template) => {
    let systemInstruction = template.task 
        + "\n RULES: " + template.rules.join("\n");

    let userPrompt = template.input
        + "\n" + template.others.join("\n");

    for (const inputItem of Object.keys(input)) {
        const placeholder = `{{${inputItem}}}`;
        const value = input[inputItem];
        systemInstruction = systemInstruction.replace(placeholder, value);
        userPrompt = userPrompt.replace(placeholder, value);
    }

    return {
        systemInstruction,
        userPrompt
    }
}