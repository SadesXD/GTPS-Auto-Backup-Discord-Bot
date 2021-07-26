const discord = require("discord.js");
const Data = require("../Data/data.json");
const moment = require("moment");
const ms = require("ms");

exports.run = async (client, message, args) => {
  let get_data = Data.time;
  if (!get_data) {
    return message.channel.send("You don't have a backup of your server !");
  }
  
  const embed = new discord.MessageEmbed()
    .setAuthor("Last backup time")
    .setColor("RANDOM")
    .addField("Last time (UTC-Time)", `\`\`\`${moment.utc(get_data).format("lll")}\`\`\``, true)
    .addField("Time now (UTC-Time)", `\`\`\`${moment.utc(Date.now()).format("lll")}\`\`\``, true)
    .addField("Since", `\`\`\`${ms(Date.now() - get_data)} Ago\`\`\``)
    .setTimestamp();
  return message.channel.send(embed);
};
