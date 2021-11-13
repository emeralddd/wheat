const bot = require('wheat-better-cmd')
const {MessageAttachment, Message} = require('discord.js')
const help = {
	name:"tarot",
    htu:"",
    des:"Xem bài Tarot với mục đích giải trí, không nên tin tưởng hoàn toàn!",
    group:"ftelling",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
   	const tarotMeaning = await bot.wheatReadJSON('./storage/tarot_meaning.json')
	const randomCard = tarotMeaning[Math.floor(Math.random() * 78) + 1]
	const embed = await bot.wheatSampleEmbedGenerate()
	embed.setAuthor('⁘ ' + message.member.displayName + ', lá bài Tarot của bạn là ...')
	embed.setTitle(`${randomCard.version?`<a:VC_verify5:704210216434008074>`:``}** ${randomCard.name}!**`)
	embed.setDescription('Thuộc bộ ẩn ' + (randomCard.type === '1' ? 'chính' : 'phụ'))

	embed.addFields(
		{
			name: 'Từ khóa',
			value: randomCard.keywords
		}
	)
	if(!randomCard.version) {

		embed.addFields(
			{
				name: 'Ý nghĩa',
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
				name: 'Mô tả Bài',
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
				name: 'Giải nghĩa',
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
	
    const fileimage = randomCard.image
	const attachment = new MessageAttachment('./storage/tarot_image/' + fileimage,fileimage)
	embed.setImage('attachment://' + fileimage)
    bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
}

module.exports.run = run

module.exports.help = help