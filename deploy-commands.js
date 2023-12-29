const { REST, Routes } = require("discord.js");
const tallyFile = require("./commands/tally.js");

require("dotenv").config();
const {
  CLIENT_ID: applicationId,
  GUILD_ID: guildId,
  TOKEN: token,
} = process.env;

const commands = [tallyFile.data.toJSON()];
const rest = new REST({ version: "10" }).setToken(token);

const deployCommands = async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
      body: commands,
    });
    console.log("サーバー固有のコマンドが登録されました！");
  } catch (error) {
    console.error("コマンドの登録中にエラーが発生しました:", error);
  }
};

module.exports = { deployCommands };
