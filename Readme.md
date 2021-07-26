# GTPS Auto Backup Discord Bot

## Credit

- Project inspired by: [GTPSControllerDiscordBot](https://github.com/GuckTubeYT/GTPSControllerDiscordBot)
- Some code: [Here](https://coderrocketfuel.com/article/get-the-total-size-of-all-files-in-a-directory-using-node-js)
- Helper: [GucktubeYT#3123](https://github.com/GuckTubeYT)

## Description

This project will help you to backup your gtps server using discord bot

## Package required

- common-tags
- cpu-stat
- discord.js
- fs
- ms
- moment
- path
- zip-folder

## How to use

- Go to your vps and install this project
- Extract zip file from downloaded this project
- Install Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- Setting app in [config.json](#Config) file
- Go to `Build` folder and click `install.bat` file for install the requirement package
- If you done installed, In `Build` folder click `start.bat` file for start the program

## Config

### Configuration in `config.json` file

- delay: this config must be ends with "s", "m", "h", "d"

  - "s" for seconds, example usage: "1s" -> 1 second
  - "m" for minutes, example usage: "1m" -> 1 minute
  - "h" for hours, example usage: "1h" -> 1 hour
  - "d" for days, example usage: "1d" -> 1 day

```js
{
  "prefix": "", // Your bot prefix command
  "token": "", // Your bot token
  "secret_channels": "", // Discord Channels id, Backup file will auto send into this channel
  "role_id": "", // role id (Discord server role) will you allow for using backup command (Owner role id is recomended)
  "user_id": "", // only this user can using "backup" command, this is optional you can ignore this (optional)
  "delay": "", // Delay every backup, Backup file will auto send every (this delay config), example usage: "1s", "1m", "1h","1d"
  "world_folder": "Path/to/world_folder/", // Path into your world folder
  "player_folder": "Path/to/player_folder", // Path into your player folder
  "gtps_folder": "Path/to/gtps_folder" // Path into your gtps folder
}
```

## Notes

- Don't sell this project, because this project is already Open Source (Free to use)
- Don't delete `Data` folder and `all files` in `Data`
  folder
- Report to [https://github.com/SadesXD/GTPS-Auto-Backup-Discord-Bot/issues](https://github.com/SadesXD/GTPS-Auto-Backup-Discord-Bot/issues) or [Our Discord Server](https://discord.gg/Kj8TYuCjbU) if you found some bug

## Updated

<h3><b>3 - July - 2021</b></h3>

- Fixed backup zip file is not fully send
- make some code more shortly/simple

<h3><b>9 - July - 2021</b></h3>

- Fixed file is not send if backup size is more than 8 mb
- Added http web server, useful for send a backup if size of backup is more than 8 mb
- Added more code

<h3><b>26 - July - 2021</b></h3>

- Fixed `Unexpected token` json error
- Added new function for fix `config.json` if the user get an error when filling the config
- Fixed delay can't set more than 2m
- Remove cooldown when backup the server
- Fixed private ip ( web can't be reached )
- Added new method for set the players / worlds / gtps path folder
- Make the code more simple
- Big thanks to [GucktubeYT#3123](https://github.com/GuckTubeYT) for help us to fix the problem
