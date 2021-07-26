const discord = require("discord.js");
const client = new discord.Client({
    restRequestTimeout: 120000
});
const fs = require("fs");
const http = require("http");
const ms = require("ms")
const data = require("./Data/data.json");
const backup = require("./main.js");
const config = require("./config.json");

backup.check_requirement()

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

client.on("ready", () => {
    client.user.setActivity(`GTPS Auto Backup | ${config.prefix}help | SadesXD#3971`, {
        type: "WATCHING"
    });
    backup.info_log(`${client.user.tag} is ready !`);

    if (config.delay) {
        setInterval(() => {
            backup.send_backup({ http: httpServer, client });
        }, ms(config.delay));
    }
})

client.on("message", (message) => {
    if (message.author.bot || 
        message.channel.type == "dm" ||
        !message.content.startsWith(config.prefix)) return;
    
    let args = message.content.slice(config.prefix.length).trim().split(" ");
    let command = args.shift().toLowerCase();
    if (!command) return;

    if (!fs.existsSync(`./Commands/${command}.js`)) return;
    let commandfile = require(`./Commands/${command}.js`);

    try {
        commandfile.run(client, message, args);
    } catch (error) {
        console.error(error.message);
    }
});

client.login(config.token);

// source: https://stackoverflow.com/questions/20273128/how-to-get-my-external-ip-address-with-node-js/38903732
http.get({
    host : "ipv4bot.whatismyipaddress.com",
    port : 80,
    path : "/"
}, function(res) {
    res.on("data", function(chunk) {
        data.ip = chunk;
    });
}).on('error', function(e) {
    data.ip = "127.0.0.1";
});

exports.http = httpServer;
