let member=[];
let details;

module.exports.init = (data) => {
    details=data;
};

module.exports.validate = (userId,command) => {
    const now=Date.now();
    if(!member[userId]) {
        member[userId]={
            latest:0
        };
    }

    if(now-member[userId].latest<=1000) return 2;

    if(!details[command].rate) {
        member[userId].latest=now;
        return 1;
    }

    if(member[userId].command&&now-member[userId].command<=details[command].rate) {
        return 0;
    }

    member[userId].latest=now;
    member[userId].command=now;
    return 1;
};

module.exports.release = () => {
    member=[];
}