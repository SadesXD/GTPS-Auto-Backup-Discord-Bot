/**
 * This app is created by SadesXD#3971
 * Helper: GucktubeYT#3123
 * Please give some credit if you're using this app
 */

const Discord = require("discord.js");
const fs = require("fs")
const http = require("http");
const ms = require("ms");
const client = new Discord.Client({
  restRequestTimeout: 120000,
});
const { prefix, token, delay } = require("./config.json");
const { existsSync } = require("fs");
const data = require("./Data/Data.json");

const Backup = require("./main");
const backup = new Backup(client, {
  config: require("./config.json"),
  discord: Discord,
});
var opt = {
  host : "ipv4bot.whatismyipaddress.com",
  port : 80,
  path : "/"
}

backup.check_requirement();
const httpServer = http.createServer(function (req, res) {
  if (req.url === "/GTPS_Backup.zip?keydw=" + data.key ) {
    const fread = fs.readFileSync("GTPS_Backup.zip", "binary")
    res.writeHead(200, {"Content-Type": "application/zip"});
    res.write(fread, "binary");
    return res.end();
  } else {
    res.writeHead(401, "Auth key needed")
    res.write("Authentication Key Need");
    return res.end();
  }
})

client.on("ready", async () => {
  client.user.setActivity(`GTPS Auto Backup | ${prefix}help | By SadesXD#3971`, {
    type: "WATCHING",
  });

  backup.infoLog(`${client.user.tag} is ready now`);
  if (!delay.length == 0)
  {
    setInterval(() => {
      backup.send_backup(httpServer);
    }, ms(delay));
  }
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
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

client.login(token);

// source: https://stackoverflow.com/questions/20273128/how-to-get-my-external-ip-address-with-node-js/38903732

http.get(opt, function(res) {
  res.on("data", function(chunk) {
    data.ip = chunk;
  });
}).on('error', function(e) {
  data.ip = "127.0.0.1";
});

module.exports = {
  http: httpServer
}
