const databaseManager = require('../../modules/databaseManager');
const bot = require('wheat-better-cmd');
const { Request } = require("../../structure/Request");

module.exports = {
    name: "selectLanguage",
    /**
     * @param {Request} request 
     */
    async run(request, t) {
        const memberId = request.interaction.member.id;
        const find = await databaseManager.getMember(memberId);
        const embed = bot.wheatSampleEmbedGenerate();
        
        const newLanguage = request.interaction.values[0];
        
        try {
            if (find.id) {
                await databaseManager.updateMember(memberId, {
                    language: newLanguage
                });
            } else {
                await databaseManager.newMember(memberId, {
                    language: newLanguage
                });
            }

            let afterLang = newLanguage;
            if (newLanguage === 'unset') {
                const serverInfo = await databaseManager.getServer(request.interaction.guild.id);
                afterLang = serverInfo.language || 'vi';
                newLanguage = t('main.unset', {}, serverInfo.language);
            }
            
            embed.setTitle(t('main.successExecution', {}, afterLang));
            embed.setDescription(t('main.changeSelfLanguageTo', { lang: newLanguage }, afterLang));
            await request.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            await request.reply(t('error.undefinedError'));
        }
    }
}