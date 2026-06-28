require('events').EventEmitter.prototype._maxListeners = Infinity;
require('events').defaultMaxListeners = Infinity;
const { ChannelType, Client, GatewayIntentBits, ActivityType, Events, SnowflakeUtil, RESTJSONErrorCodes } = require('discord.js');
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

const languageBase = require('./modules/languageBase');
const commandBase = require('./modules/commandBase');
const rateLimiter = require('./modules/rateLimiter');
const interactionDataBase = require('./modules/interactionDataBase');

const { Request } = require('./structure/Request');
const i18next = require('i18next');

let isInitial = false;

const firstInit = () => {
    if (isInitial) return;
    try {
        languageBase.initiate();
        commandBase.initiate();
        databaseManager.connect();
        isInitial = true;
    } catch (error) {
        console.log(error);
    }
}

// Login and ready
wheat.once(Events.ClientReady, async () => {
    firstInit();
    console.log(`[${wheat.shard.ids[0]}] Da dang nhap duoi ten ${wheat.user.tag}!`);
});

// Welcome DM to server owner
wheat.on(Events.GuildCreate, async (guild) => {
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
});


// Handle interactions which are not slash commands
wheat.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) return;

    
    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'live') {
        
        const allowUsers = ['687301490238554160'];
        
        if (!interaction.member) return;
        if (!allowUsers.includes(interaction.member.id)) return;
    }
    
    try {
        const memberId = interaction.user.id;
        const guildId = interaction.guildId;
        const channelId = interaction.channelId;

        const [executeInteractionId, dataId] = interaction.customId.split('_');

        if (commandBase.interactionHas(executeInteractionId)) {
            const interactionHandler = commandBase.interactionGet(executeInteractionId);
            const serverInfo = await databaseManager.getServer(guildId);
            const memberInfo = await databaseManager.getMember(memberId);

            const language = memberInfo?.language ?? serverInfo?.language ?? process.env.CODE;

            const t = (str, opt = {}, lang = language) => {
                return i18next.t(str, { ...opt, lng: lang });
            }

            const request = new Request(interaction, language, true);

            request.interactionDataId = dataId;

            await interactionHandler.run(request, t);
        }
    } catch (error) {
        console.log(error.message === 'Unknown interaction' ? 'Unknown interaction' : error);
    };
})

// Handle interactions which are slash commands
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
                content: `Slash Command qua DM sẽ được hoạt động trong tương lai! Slash Command via DM will be activated soon!`
            });
            return;
        }

        const executeCommand = interaction.commandName;

        if (commandBase.commandHas(executeCommand)) {
            const command = commandBase.commandGet(executeCommand);
            const serverInfo = await databaseManager.getServer(guildId);
            const memberInfo = await databaseManager.getMember(memberId);

            const prefix = serverInfo?.prefix ?? process.env.PREFIX;
            const language = memberInfo?.language ?? serverInfo?.language ?? process.env.CODE;

            const t = (str, opt = {}, lang = language) => {
                return i18next.t(str, { ...opt, lng: lang });
            }

            if (await databaseManager.getDisableCommand(channelId, executeCommand)) {
                return interaction.reply({
                    enforceNonce: true,
                    nonce: SnowflakeUtil.generate().toString(),
                    content: t('error.notUseHere', { executeCommand }),
                    ephemeral: true
                });
            }

            const status = rateLimiter.validate(memberId, executeCommand);

            if (status !== 0) {
                return interaction.reply({
                    enforceNonce: true,
                    nonce: SnowflakeUtil.generate().toString(),
                    content: t('main.rateLimit', { sec: status }),
                    ephemeral: true
                });
            }

            await interaction.deferReply();
            const request = new Request(interaction, language, true);

            databaseManager.logRequest(guildId, request.createdTimestamp, executeCommand, 1);

            await command.run({
                wheat,
                t,
                request,
                prefix,
                memberInfo,
                serverInfo
            });
        }
    } catch (error) {
        console.log(error.message === 'Unknown interaction' ? 'Unknown interaction' : error);
    };
});

wheat.on(Events.MessageCreate, async (message) => {
    if (message.channel.type === ChannelType.DM) {
        return;
    }

    if (message.author.bot) {
        return;
    }

    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'live') {
        const allowUsers = ['687301490238554160'];
        if (!allowUsers.includes(message.author.id)) return;
    }

    try {
        const msg = message.content;
        const memberId = message.author.id;
        const guildId = message.guildId;
        const channelId = message.channel.id;

        // Check if message is empty
        if (!msg) return;

        // Note: removed and replaced in future update
        if (memberId === '687301490238554160' && msg === 'ereload') {
            announcement = require('./announcement.json');
        }

        // Check if message contains command
        if (!commandBase.checkCommandInString(msg.toLowerCase())) {
            return;
        }

        const serverInfo = await databaseManager.getServer(guildId);
        const prefix = serverInfo?.prefix ?? process.env.PREFIX;

        // Check if message is a mention of the bot
        const isMention = msg === `<@${wheat.user.id}>` || msg === `<@!${wheat.user.id}>`;
        if (isMention) {
            const memberInfo = await databaseManager.getMember(memberId);
            const language = memberInfo?.language ?? serverInfo?.language ?? process.env.CODE;
            const t = (str, opt = {}, lang = language) => {
                return i18next.t(str, { ...opt, lng: lang });
            }

            const request = new Request(message, language, false);

            await request.reply(t('main.myPrefix', { prefix }));
            return;
        }

        // Check if message starts with prefix
        if (!msg.toLowerCase().startsWith(prefix.toLowerCase())) {
            return;
        }

        const S = msg
            .substring(prefix.length)
            .split(' ');

        // Split message into command and arguments
        const args = S.filter(arg => arg !== '');

        // Check if there are any arguments
        if (args.length === 0) return;

        // Get command name and check if it exists
        const cmd = args[0].toLowerCase();

        // Check if command exists in command list or alias list
        // or mention bot 
        if (!commandBase.commandHas(cmd) && !commandBase.aliaseHas(cmd)) {
            return;
        }

        // Check if command is alias
        let executeCommand = cmd;
        if (commandBase.aliaseHas(executeCommand)) {
            executeCommand = commandBase.aliaseGet(executeCommand);
        }

        // Get command object
        const command = commandBase.commandGet(executeCommand);

        // Check if command is disabled in this channel
        if (await databaseManager.getDisableCommand(channelId, executeCommand)) {
            return;
        }

        // Get member info and language
        const memberInfo = await databaseManager.getMember(memberId);
        const language = memberInfo?.language ?? serverInfo?.language ?? process.env.CODE;
        const t = (str, opt = {}, lang = language) => {
            return i18next.t(str, { ...opt, lng: lang });
        }

        const request = new Request(message, language, false);

        // Check if user with this command is rate limited
        const status = rateLimiter.validate(memberId, executeCommand);
        if (status !== 0) {
            await request.reply(t('main.rateLimit', { sec: status }));
            return;
        }

        // Log request to database
        databaseManager.logRequest(guildId, request.createdTimestamp, executeCommand, 0);

        // Run command
        await command.run({
            wheat,
            t,
            request,
            cmd,
            S,
            args,
            prefix,
            memberInfo,
            serverInfo
        });

        // Check if announcement is active and not ignored for this command or group
        if (announcement.status === 'active' && !announcement.ignoredcommand.includes(executeCommand) && !announcement.ignoredparents.includes(command.help.group)) {
            const embed = bot.wheatSampleEmbedGenerate();
            embed.setTitle(announcement.title);
            embed.setDescription(announcement.description);
            await request.reply({ embeds: [embed] });
        }
    } catch (error) {
        console.log("Error while executing command: ", error);
    }
});

wheat.login((process.env.NODE_ENV === 'dev' ? process.env.TOKEN : process.env.TOKEN2));