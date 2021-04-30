/**
 * This app is created by SadesXD#3971
 * Please give some credit if you're using this app
 */

const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix, token } = require("./config.json");
const { existsSync } = require("fs")

const Backup = require('./main');
const backup = new Backup(client, {
  config: require("./config.json"),
  discord: Discord
});

// Utils
const reply_backup = require("./Commands/backup");

client.on("ready", async () => {
  
  client.user.setActivity(`GTPS Auto Backup | ${prefix}help`, {
    type:"WATCHING"
  });
  
  console.log(`${client.user.tag} is ready now`);
  backup.send_backup();
});

client.on("message", async (message) => {
  if (message.author.bot) return;

  reply_backup.send_msg(message);

  if (!message.content.startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).trim().split(" ");
  let command = args.shift().toLowerCase();
  if (!command) return;

  if (!existsSync(`./Commands/${command}.js`)) return;
  let commandFile = require(`./Commands/${command}.js`);

  try {
    commandFile.run(client, message, args);
  } catch (error) {
    console.log(error.message);
  }
});

client.login(token)