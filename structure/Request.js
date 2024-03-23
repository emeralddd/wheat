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

class Request {
    static RequestIsInteraction = 0;
    static RequestIsMessage = 1;

    constructor(source, type) {
        if (type === this.RequestIsInteraction) {
            this.isInteraction = true;
            this.interaction = source;
            this.author = this.user;
        } else {
            this.isInteraction = false;
            this.message = source;
            this.author = this.author;
        }

        this.channel = source.channel;
        this.channelId = source.channelId;
        this.createdAt = source.createdAt;
        this.createdTimestamp = source.createdTimestamp;
        this.guild = source.guild;
        this.guildId = source.guildId;
        this.id = source.id;
        this.member = source.member;
    }

    reply() {

    }

    follow() {

    }

    edit() {

    }

    delete() {

    }

}