const Discord = require("discord.js");
const { readdirSync } = require("fs");

exports.run = async(client, message, args) => {
    let Commands = get_all_command();
    let command = [...Commands].map(x => x = `\`${x}\``).join(", ");

    const embed = new Discord.MessageEmbed()
    .setAuthor('Commands List')
    .addField(`Commands[${Commands.length}]`, command, true)
    .setColor("RANDOM")
    .setTimestamp()
    return message.channel.send(embed);
    
};

function get_all_command() {
    let command = readdirSync("./Commands");
    return command.map(x => x.split(".")[0]);
}