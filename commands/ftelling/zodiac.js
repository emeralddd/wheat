const bot = require('wheat-better-cmd')
const {MessageAttachment, Message} = require('discord.js')
const moment = require('moment')

const help = {
    name:"zodiac",
    group:"ftelling",
    aliases: ["hoangdao"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const date = args[1]

    const mmt =moment(date,'DD/MM',true)
    if(!mmt.isValid()&&date!=='29/02') {
        await bot.wheatSendErrorMessage(message,lg.error.formatError)
        return
    }

    const zodiac = await bot.wheatReadJSON('./assets/content/zodiacMeaning.json')

    let str_time = []
    let end_time = []
    const compareDate = moment(date, "DD/MM")
    str_time[0] = moment("20/03", "DD/MM")
    str_time[1] = moment("19/04", "DD/MM")
    str_time[2] = moment("20/05", "DD/MM")
    str_time[3] = moment("21/06", "DD/MM")
    str_time[4] = moment("22/07", "DD/MM")
    str_time[5] = moment("22/08", "DD/MM")
    str_time[6] = moment("22/09", "DD/MM")
    str_time[7] = moment("22/10", "DD/MM")
    str_time[8] = moment("22/11", "DD/MM")
    str_time[9] = moment("21/12", "DD/MM")
    str_time[10] = moment("19/01", "DD/MM")
    str_time[11] = moment("18/02", "DD/MM")
    end_time[0] = moment("20/04", "DD/MM")
    end_time[1] = moment("21/05", "DD/MM")
    end_time[2] = moment("22/06", "DD/MM")
    end_time[3] = moment("23/07", "DD/MM")
    end_time[4] = moment("23/08", "DD/MM")
    end_time[5] = moment("23/09", "DD/MM")
    end_time[6] = moment("23/10", "DD/MM")
    end_time[7] = moment("23/11", "DD/MM")
    end_time[8] = moment("22/12", "DD/MM")
    end_time[9] = moment("20/01", "DD/MM")
    end_time[10] = moment("19/02", "DD/MM")
    end_time[11] = moment("21/03", "DD/MM")
        
    let i
    for(i=0; i<=11; i++) {
        if(compareDate.isBetween(str_time[i],end_time[i])) {
            break
        }
    }
    
    if(date==='29/02') i=11
    if(i===12) i=9

    const tinhchat=[lg.fortune.modalityCardinal,lg.fortune.modalityFixed,lg.fortune.modalityMutable]
    const tukhoatc=[lg.fortune.keywordsCardinal,lg.fortune.keywordsFixed,lg.fortune.keywordsMutable]
    const nguyento=[lg.fortune.elementFire,lg.fortune.elementEarth,lg.fortune.elementAir,lg.fortune.elementWater]
    const tukhoangto=[lg.fortune.keywordsFire,lg.fortune.keywordsEarth,lg.fortune.keywordsAir,lg.fortune.keywordsWater]

    embed.setAuthor({name:`⋗ ${lg.fortune.zodiacth}: ${String(i+1)}`})
    embed.setTitle(zodiac[i].unicode+" "+zodiac[i].name)
    embed.addFields(
        {
            name:`∴ ${lg.fortune.characteristic}`,
            value:`⋄ ${lg.fortune.gloss}: ${zodiac[i].gloss}\n⋄ ${lg.fortune.eclipticLongitude}: ${i*30}° ${lg.fortune.to} ${(i+1)*30}°\n⋄ ${lg.fortune.time1}: ${zodiac[i].start} ${lg.fortune.to} ${zodiac[i].end}\n⋄ ${lg.fortune.opposite}: ${zodiac[i].doilap}`
        },
        {
            name:`∴ ${lg.fortune.modality}`,
            value:`⋯ ${lg.fortune.modality}: ${tinhchat[i%3]}\n⋯ ${lg.fortune.keywords}: ${tukhoatc[i%3]}`
        },
        {
            name:`∴ ${lg.fortune.element}`,
            value:`⋯ ${lg.fortune.belongsToElement}: ${nguyento[i%4]}\n⋯ ${lg.fortune.keywords}: ${tukhoangto[i%4]}`
        },
        {
            name:`∴ ${lg.fortune.ruler}`,
            value:`⋇ ${lg.fortune.classic}: ${zodiac[i].sao_cd}\n⋇ ${lg.fortune.modern}: ${zodiac[i].sao_hd}`
        },
        {
            name:`∴ ${lg.fortune.ddef}`,
            value:`≫ ${lg.fortune.dignity}: ${zodiac[i].phamgia}\n≫ ${lg.fortune.detriment}: ${zodiac[i].batloi}\n≫ ${lg.fortune.exaltation}: ${zodiac[i].dacdia}\n≫ ${lg.fortune.fall}: ${zodiac[i].suythoai}`
        }
    )

	const attachment = new MessageAttachment(`./assets/image/zodiacImage/${i+1}.png`,`${i+1}.png`)
    embed.setThumbnail(`attachment://${i+1}.png`)

    await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
}

module.exports.run = run

module.exports.help = help