require('events').EventEmitter.prototype._maxListeners = Infinity;
require('events').defaultMaxListeners = Infinity;
const { Collection, Client, GatewayIntentBits, ActivityType, Events, SnowflakeUtil, RESTJSONErrorCodes } = require('discord.js');
const databaseManager = require('./modules/databaseManager');
const bot = require('wheat-better-cmd');
require('dotenv').config({ path: 'secret.env' });
let announcement = require('./announcement.json');

const wheat = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent], presence: {
        activities: [{
            name: 'EHELP',
            type: ActivityType.Listening
        }],
        status: 'online'
    }
});

let commandsList = new Collection();
let aliasesList = new Collection();
let helpMenu = [];
let groupMenu = {};
let language = [];
let all = [];
let groups = [];
const langList = ['vi_VN', 'en_US'];

const importLanguage = require('./modules/importLanguage');
const addCommands = require('./modules/addCommands');
const rateLimiter = require('./modules/rateLimiter');
const { Request } = require('./structure/Request');
const parseString = require('./modules/parseString');

let isInitial = false;

const initial = async () => {
    if (isInitial) return;
    try {
        ({ groupMenu, helpMenu, aliasesList, commandsList, all, groups } = await addCommands(langList));
        language = importLanguage(langList);
        databaseManager.connect();
        isInitial = true;
    } catch (error) {
        console.log(error);
    }
}

wheat.once('ready', async () => {
    await initial();
    console.log(`[${wheat.shard.ids[0]}] Da dang nhap duoi ten ${wheat.user.tag}!`);
})

wheat.on('guildCreate', async (guild) => {
    const ownerId = await guild.fetchOwner();
    const embed = bot.wheatSampleEmbedGenerate();
    embed.setTitle(`Cảm ơn bạn vì đã sử dụng bot Wheat!`);
    embed.setDescription("Một số thứ dưới đây sẽ giúp bạn làm quen với bot:\n\n- Prefix mặc định của bot là `e`. Bạn có thể thay đổi bằng lệnh `eprefix`.\n\n- Ping bot để xem prefix hiện tại của bot.\n\n- Sử dụng lệnh `ehelp` để xem danh sách lệnh của bot.\n\n- Nếu còn điều gì thắc mắc, hãy sử dụng lệnh `esupport`.\n\n**Chúng tôi mong bạn sẽ có những trải nghiệm tốt nhất với Wheat!**");

    const embed1 = bot.wheatSampleEmbedGenerate();
    embed1.setTitle(`Thanks for using Wheat!`);
    embed1.setDescription("There are somethings can help you get started with bot:\n\n- Default prefix of bot is `e`. You can change it using `eprefix`.\n\n- Ping bot to see prefix of bot at specific server.\n\n- Using `ehelp` to see commands lists of bot.\n\n- If you has any questions, please use command `esupport`.\n\n**Hope you have the best experiences with Wheat!**");

    try {
        await ownerId.send({ enforceNonce: true, nonce: SnowflakeUtil.generate().toString(), embeds: [embed, embed1] });
        await ownerId.send({ enforceNonce: true, nonce: SnowflakeUtil.generate().toString(), content: '🌾**Support Server:** https://discord.gg/z5Z4uzmED9' });
    } catch (error) {
        if (error.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) return;
        console.log(error);
    };
})

wheat.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'live') {

        const allowUsers = ['687301490238554160'];

        if (!interaction.member) return;
        if (!allowUsers.includes(interaction.member.id)) return;
    }

    try {
        const memberId = interaction.user.id;
        const guildId = interaction.guildId;
        const channelId = interaction.channelId;

        if (!guildId) {
            await interaction.reply({
                enforceNonce: true,
                nonce: SnowflakeUtil.generate().toString(),
                content: `Slash Command qua DM sẽ được hoạt động trong tương lai!`
            });
            return;
        }

        const executeCommand = interaction.commandName;

        if (commandsList.has(executeCommand)) {
            const command = commandsList.get(executeCommand);

            if (await databaseManager.getDisableCommand(channelId, executeCommand)) {
                await interaction.reply({
                    enforceNonce: true,
                    nonce: SnowflakeUtil.generate().toString(),
                    content: `Lệnh ${executeCommand} không được sử dụng tại kênh này!`,
                    ephemeral: true
                });
                return;
            }

            let prefix = process.env.PREFIX;
            let lang = process.env.CODE;

            const serverInfo = await databaseManager.getServer(guildId);
            const memberInfo = await databaseManager.getMember(memberId);

            if (serverInfo) {
                prefix = serverInfo.prefix || prefix;
                lang = serverInfo.language || lang;
            }

            if (memberInfo) {
                lang = memberInfo.language || lang;
            }

            const lg = language[lang];

            const status = rateLimiter.validate(memberId, executeCommand);

            if (status !== 0) {
                await interaction.reply({
                    content: parseString(language[lang].main.rateLimit, { sec: status }),
                    ephemeral: true
                });
                return;
            }

            await interaction.deferReply();
            const request = new Request(interaction, lang, true);

            databaseManager.logRequest(guildId, request.createdTimestamp, executeCommand, 1);

            command.run({
                wheat,
                request,
                interaction,
                helpMenu,
                groupMenu,
                prefix,
                commandsList,
                aliasesList,
                language,
                lang,
                lg,
                langList,
                all,
                groups,
                serverInfo
            });
        }
    } catch (error) {
        console.log(error.message === 'Unknown interaction' ? 'Unknown interaction' : error);
    };
});

wheat.on('messageCreate', async (message) => {
    if (message.channel.type === "dm") return;

    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'live') {
        const allowUsers = ['687301490238554160'];
        if (!allowUsers.includes(message.author.id)) return;
    }

    try {
        const msg = message.content;
        const memberId = message.author.id;
        const guildId = message.guildId;
        const channelId = message.channel.id;

        if (!msg) return;

        if (memberId === '687301490238554160' && msg === 'ereload') {
            announcement = require('./announcement.json');
        }

        let prefix = process.env.PREFIX;
        let lang = process.env.CODE;

        const serverInfo = await databaseManager.getServer(guildId);

        if (serverInfo) {
            prefix = serverInfo.prefix || prefix;
            lang = serverInfo.language || lang;
        } else {
            prefix = process.env.PREFIX;
        }

        const memberInfo = await databaseManager.getMember(memberId);

        if (memberInfo) {
            lang = memberInfo.language || lang;
        }

        const lg = language[lang];

        const request = new Request(message, lang, false);

        if (msg === '<@786234973308715008>') {
            await request.reply(`${language[lang].main.myPrefix}: ** ${prefix} ** `);
            return;
        }

        if (!msg.toLowerCase().startsWith(prefix.toLowerCase())) return;

        const S = msg.substring(prefix.length).split(' ');
        let args = [];

        for (const i of S) {
            if (i !== '') args.push(i);
        }

        if (args.length === 0) return;

        const cmd = args[0].toLowerCase();
        let executeCommand = cmd;
        if (aliasesList.has(executeCommand)) {
            executeCommand = aliasesList.get(executeCommand);
        }

        request.language = lang;

        if (commandsList.has(executeCommand)) {
            const command = commandsList.get(executeCommand);

            if (await databaseManager.getDisableCommand(channelId, executeCommand)) {
                return;
            }

            const status = rateLimiter.validate(memberId, executeCommand);

            if (status !== 0) {
                await request.reply(parseString(language[lang].main.rateLimit, { sec: status }));
                return;
            }

            try {
                databaseManager.logRequest(guildId, request.createdTimestamp, executeCommand, 0);
                await command.run({
                    wheat,
                    request,
                    S,
                    message,
                    msg,
                    args,
                    helpMenu,
                    groupMenu,
                    prefix,
                    commandsList,
                    aliasesList,
                    language,
                    lang,
                    cmd,
                    lg,
                    langList,
                    all,
                    groups,
                    serverInfo
                });

                if (announcement.status === 'active' && !announcement.ignoredcommand.includes(executeCommand) && !announcement.ignoredparents.includes(helpMenu[executeCommand].group)) {
                    const embed = bot.wheatSampleEmbedGenerate();
                    embed.setTitle(announcement.title);
                    embed.setDescription(announcement.description);
                    await request.reply({ embeds: [embed] });
                }

            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
});

wheat.login((process.env.NODE_ENV === 'dev' ? process.env.TOKEN : process.env.TOKEN2));
