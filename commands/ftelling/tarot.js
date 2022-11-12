const bot = require('wheat-better-cmd')
const {AttachmentBuilder, Message, ChatInputCommandInteraction} = require('discord.js')

const help = {
	name:"tarot",
    group:"ftelling",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message 
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const run = async ({message,interaction,lg}) => {
	message = message || interaction

   	const tarotMeaning = await bot.wheatReadJSON('./assets/content/tarotMeaning.json')
	const randomCard = tarotMeaning[Math.floor(Math.random() * 78) + 1]
	const embed = bot.wheatSampleEmbedGenerate()
	embed.setAuthor({name:`⁘ ${message.member.displayName}, ${lg.fortune.yourTarotCardIs} ...`})
	embed.setTitle(`${randomCard.version?`<a:VC_verify5:704210216434008074>`:``}** ${randomCard.name}!**`)
	embed.setDescription(randomCard.type === '1' ? lg.fortune.majorArcana : lg.fortune.minorArcana)

	embed.addFields(
		{
			name: lg.fortune.keywords,
			value: randomCard.keywords
		}
	)
	if(!randomCard.version) {

		embed.addFields(
			{
				name: lg.fortune.meaning,
				value: randomCard.meaning
			}
		)
		if (randomCard.meaning1)
			embed.addFields({
				name: '▿',
				value: randomCard.meaning1
			})

		if (randomCard.meaning2)
			embed.addFields({
				name: '▿',
				value: randomCard.meaning2
			})
	} else {
		embed.addFields(
			{
				name: lg.fortune.cardDescription,
				value: randomCard.description
			}
		)

		if (randomCard._description)
			embed.addFields({
				name: '▿',
				value: randomCard._description
			})

		embed.addFields(
			{
				name: lg.fortune.meaning,
				value: randomCard.meaning
			}
		)

		if (randomCard._meaning)
			embed.addFields({
				name: '▿',
				value: randomCard._meaning
			})

		if (randomCard.__meaning)
			embed.addFields({
				name: '▿',
				value: randomCard.__meaning
			})
	}
	
	embed.setFooter({text:"Nguồn: Tarot.vn"})
	const attachment = new AttachmentBuilder(`./assets/image/tarotImage/${randomCard.image}`,randomCard.image)
	embed.setImage(`attachment://${randomCard.image}`)
    bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
}

module.exports.run = run

module.exports.help = help