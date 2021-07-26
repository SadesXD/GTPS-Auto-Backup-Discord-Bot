const discord = require("discord.js");
const { readdirSync } = require("fs");
const seperate = ", "

exports.run = (client, message, args) => {
    let cmd = readdirSync("./Commands")
    let command = cmd.map(x => x = "`" + x.split(".")[0] + "`").join(seperate);
    const embed = new discord.MessageEmbed()
    .setAuthor("Command list")
    .setColor("RANDOM")
    .addField(`Commands [${cmd.length}]`, command, true)
    .setTimestamp()

    return message.channel.send(embed);
}
