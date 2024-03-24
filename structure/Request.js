/*1. Nhận message/interaction và chuyển thành dạng Request
    Message: 
        author -> User
        channel -> TextBasedChannels
        channelId -> Snowflake
        content -> string
        createdAt -> Date
        createdTimestamp -> number
        guild -> Guild
        guildId -> Snowflake
        id -> Snowflake
        member -> GuildMember (*)  
        url -> string
    Interaction:
        channel -> TextBasedChannels
        channelId -> Snowflake
        createdAt -> Date
        createdTimestamp -> number
        guild -> Guild
        guildId -> Snowflake
        id -> Snowflake
        member -> GuildMember (*)
        user -> User

    Request:
        author -> User

        channel -> TextBasedChannels
        channelId -> Snowflake
        createdAt -> Date
        createdTimestamp -> number
        guild -> Guild
        guildId -> Snowflake
        id -> Snowflake
        member -> GuildMember (*)

        isInteraction -> boolean

        message -> Message
        interaction -> ChatInput


*/

//2. Các method với Request

const { Snowflake, TextBasedChannel, User, ChatInputCommandInteraction, Message, Guild, GuildMember, MessagePayload, MessageCreateOptions, RESTJSONErrorCodes, InteractionEditReplyOptions, InteractionReplyOptions } = require('discord.js');

class Request {
    constructor(source, type) {
        /**
         * This request is Interaction?
         * @type {boolean}
         */
        this.isInteraction = type;

        /**
         * The author of the request
         * @type {User}
         */
        this.author = type ? source.user : source.author;

        /**
         * The original interaction
         * @type {ChatInputCommandInteraction}
         */
        this.interaction = type ? source : null;

        /**
         * The original message
         * @type {Message}
         */

        this.message = type ? null : source;

        /**
         * The channel of request
         * @type {TextBasedChannel}
         */
        this.channel = source.channel;

        /**
         * The channel Id of request
         * @type {Snowflake}
         */
        this.channelId = source.channelId;

        /**
         * The time the request created at
         * @type {Date}
         */
        this.createdAt = source.createdAt;

        /**
         * The timestamp the request created at
         * @type {number}
         */
        this.createdTimestamp = source.createdTimestamp;

        /**
         * The guild that this request is part of
         * @type {Guild}
         */
        this.guild = source.guild;

        /**
         * The guild Id that this request is part of
         * @type {Snowflake}
         */
        this.guildId = source.guildId;

        /**
         * The Id of the request
         * @type {Snowflake}
         */
        this.id = source.id;

        /**
         * The guild member of author
         * @type {GuildMember}
         */
        this.member = source.member;
    }

    /**
     * Handle error.
     */

    async errorHandle(error = {}) {
        if (error.code === RESTJSONErrorCodes.MissingPermissions) {
            try {
                await this.channel.send("Bot bị thiếu 1 trong các quyền `SEND_MESSAGES`, `EMBED_LINKS` hoặc `ATTACH_FILES`!");
            } catch (err) {
                if (err.code === RESTJSONErrorCodes.MissingPermissions) {
                    try {
                        await this.channel.send("Bot bị thiếu 1 trong các quyền `SEND_MESSAGES`, `EMBED_LINKS` hoặc `ATTACH_FILES`!");
                    } catch (e) {
                        if (e.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
                            return;
                        }
                    }
                }
            }
        } else {
            console.log(error);
            try {
                if (this.isInteraction) {
                    await this.editReply("Đã có lỗi trong quá trình thực thi, vui lòng thông báo về lỗi tại server hỗ trợ và thử lại sau ít phút!");
                } else {
                    await this.channel.send("Đã có lỗi trong quá trình thực thi, vui lòng thông báo về lỗi tại server hỗ trợ và thử lại sau ít phút!");
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    /**
     * Reply request.
     * @param {string|MessagePayload|MessageCreateOptions|InteractionEditReplyOptions} options The options to provide
     * @returns {Promise<Message>}
     */

    async reply(options) {
        try {
            return this.isInteraction ? await this.interaction.editReply(options) : await this.channel.send(options);
        } catch (error) {
            await this.errorHandle(error);
        }
    }

    /**
     * Follow message.
     * @param {string|MessagePayload|MessageCreateOptions|InteractionReplyOptions} options The options to provide
     * @returns {Promise<Message>}
     */

    async follow(options) {
        try {
            return this.isInteraction ? await this.interaction.followUp(options) : await this.channel.send(options);
        } catch (error) {
            await this.errorHandle(error);
        }
    }

    /**
     * Edit this request.
     * @param {string|MessagePayload|MessageCreateOptions|InteractionReplyOptions} options The options to provide
     * @returns {Promise<Message>}
     */

    async edit(options) {
        try {
            return this.isInteraction ? await this.interaction.editReply(options) : await this.message.edit(options);
        } catch (error) {
            await this.errorHandle(error);
        }
    }

    /**
     * Delete this request.
     */

    async delete() {
        try {
            if (this.isInteraction) {
                await this.interaction.deleteReply();
            } else {
                await this.message.delete();
            }
        } catch (error) {
            await this.errorHandle(error);
        }
    }

}

exports.Request = Request;