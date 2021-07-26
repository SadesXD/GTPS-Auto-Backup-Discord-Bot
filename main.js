fix_json();

const fs = require("fs");
const discord = require("discord.js");
const config = require("./config.json");
const path = require("path");
const zip = require("zip-folder");
const data = require("./Data/data.json");
const { stripIndent } = require("common-tags");
const ms = require("ms");

function get_random_string(number) {
  let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890".split("");
  let result = "";
  for (let i = 0; i < number; i++) {
    result += text[Math.floor(Math.random() * text.length)];
  }
  return result;
}

function info_log(text) {
  console.log("[Info] " + text);
}

function check_requirement() {
  info_log("Checking folder !");
  if (config.gtps_folder.includes("\\")) config.gtps_folder = config.gtps_folder.replace(/\\/g, "/");
  if (config.world_folder.includes("\\")) config.world_folder = config.world_folder.replace(/\\/g, "/");
  if (config.player_folder.includes("\\")) config.player_folder = config.player_folder.replace(/\\/g, "/");
  if (!config.gtps_folder.slice(-1).includes("/")) config.gtps_folder += "/";
  if (config.world_folder.slice(-1).includes("/")) config.world_folder = config.world_folder.slice(0, -1);
  if (config.player_folder.slice(-1).includes("/")) config.player_folder = config.player_folder.slice(0, -1);
  if (config.gtps_folder.length == 1) config.gtps_folder = "";
  if (config.player_folder.includes(config.gtps_folder)) config.player_folder = config.player_folder.replace(config.gtps_folder, "");
  if (config.world_folder.includes(config.gtps_folder)) config.world_folder = config.world_folder.replace(config.gtps_folder, "");
  if (!fs.existsSync(config.gtps_folder + config.player_folder)) throw new Error("Player folder is not found !, Receive folder: " + config.gtps_folder + config.player_folder);
  else if (!fs.existsSync(config.gtps_folder + config.world_folder)) throw new Error("World folder is not found !, Receive folder: " + config.gtps_folder + config.world_folder );
  else if (!fs.existsSync(config.gtps_folder)) throw new Error("GTPS folder is not found !, Receive folder: " + config.gtps_folder);
  info_log("Folder has been checked !");
  info_log("Checking config !");
  let list = Object.keys(config).filter((fil) => fil !== "user_id" && fil !== "delay");
  for (let l of list) {
    if (!config.role_id && config.user_id) return;
    if (!config[l]) throw new Error(`Please set "${l}" in config.json file first !`);
  }
  let mustnumber = ["secret_channels", "role_id"];
  for (let mn of mustnumber) {
    if (isNaN(config[mn])) throw new Error(`"${mn}" setting must be a number`);
  }
  if (config.delay && ms(config.delay) < ms("5m")) throw new Error(`You can't set delay under than 5m`);
  info_log("All requirement has been checked !");
}

function fix_json() {
  try {
      require("./config.json")
  } catch (err) {
      const fsx = require("fs");
      const file = fsx.readFileSync("./config.json", "utf-8");
      let fix = 
          "{" +
          file
          .split("\n")
          .map((x) => x.trim().replace("\r", "").replace(/\\/gi, "/"))
          .filter((f) => f.startsWith('"'))
          .join("") + 
          "}";
      fix = JSON.parse(fix);
      fsx.writeFileSync("./config.json", JSON.stringify(fix, null, 2))
  }
}

function check_using_http() {
  if (fs.existsSync("./GTPS_Backup.zip")) {
    let [size, name] = convertBytes(fs.statSync("./GTPS_Backup.zip").size).split(" ");
    if (name === "MB" && parseInt(size) >= 8) {
      config.using_http = true;
    } else {
      config.using_http = false;
    }
  }
  return config.using_http;
}

function save_data(time) {
  let Data = require("./Data/data.json");
  Data.time = time;
  fs.writeFileSync("./Data/data.json", JSON.stringify(Data, null, 2));
}

function send_backup({ http = null, msg = null, client = null }) {
  let dsc = stripIndent(`
  World Created Count: ${getAllFiles(config.gtps_folder + config.world_folder).length}
  World Size: ${getTotalSize(config.gtps_folder + config.world_folder)}
  Player Created Count: ${getAllFiles(config.gtps_folder + config.player_folder).length}
  Player Size: ${getTotalSize(config.gtps_folder + config.player_folder)}
  `);

  const embed = new discord.MessageEmbed()
    .setColor("RANDOM")
    .addField("Server Stats", "```" + dsc + "```")
    .setTimestamp();

  save_data(Date.now());
  zip(config.gtps_folder, "GTPS_Backup.zip", (err) => {
    if (err) return console.error(err);

    let opt = { embed, files: [{ attachment: "./GTPS_Backup.zip", name: "Backup-Result.zip" }] };
    opt = check_using_http() ? { embed } : opt;

    let ifManual = msg
      ? msg.author.send(opt).then((m) => msg.channel.send("Check your dm !"))
      : client.channels.cache.get(config.secret_channels).send(opt);

    if (msg) msg.channel.send("successfully zipped !, trying to send backup file !");
    if (check_using_http()) {
      data.key = get_random_string(30);
      if (!http.listening) http.listen(7119);

      embed.addField(
        "Backup Link",
        `[Download Link](http://${data.ip}:7119/GTPS_Backup.zip?keydw=${data.key})`,
        true
      );
      if (config.delay) embed.addField("Expire Time", "```" + config.delay + "```", true);

      return ifManual;
    } else {
      if (http.listening) http.close();
      return ifManual;
    }
  });
}

/**
 * Source: https://coderrocketfuel.com/article/get-the-total-size-of-all-files-in-a-directory-using-node-js
 */
function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

function getTotalSize(directoryPath) {
  const arrayOfFiles = getAllFiles(directoryPath);

  let totalSize = 0;

  arrayOfFiles.forEach(function (filePath) {
    totalSize += fs.statSync(filePath).size;
  });

  return convertBytes(totalSize);
}

function convertBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes == 0) {
    return "0 Bytes";
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  if (i == 0) {
    return bytes + " " + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

module.exports = {
  getAllFiles,
  getTotalSize,
  convertBytes,
  check_requirement,
  check_using_http,
  save_data,
  info_log,
  get_random_string,
  send_backup,
};
