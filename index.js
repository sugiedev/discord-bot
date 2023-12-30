require("dotenv").config();
require("./deploy-commands.js").deployCommands();
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const { TOKEN, NOTICE_USER_ID } = require("./const.js");
const admin = require("firebase-admin");
const tallyFile = require("./commands/tally.js");
const addMessage = require("./firebase/addMessage.js");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

client.once(Events.ClientReady, (c) => {
  console.log(`準備OKです! ${c.user.tag}がログインします。`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === tallyFile.data.name) {
    try {
      await tallyFile.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "コマンド実行時にエラーになりました。",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "コマンド実行時にエラーになりました。",
          ephemeral: true,
        });
      }
    }
  } else {
    console.error(
      `${interaction.commandName}というコマンドには対応していません。`
    );
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // if (message.content.match(/【.*アポイント.*】/)) {
  //   data.type = "apo";
  //   await message.react("🅰️");
  // }

  try {
    const data = {
      guildId: message.guildId,
      guildName: message.guild?.name,
      channelId: message.channel.id,
      channelName: message.channel.name,
      userId: message.author.id,
      username: message.author.username,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      messageId: message.id,
      message: message.content,
      isValid: true,
    };

    await addMessage(message.id, data);
    await message.react("👀");

    const msgLink = `https://discord.com/channels/${data.guildId}/${data.channelId}/${data.messageId}`;
    client.users.cache.get(NOTICE_USER_ID).send(`
      \`WAVE職員の書き込みがありました。\`
      サーバー: ${data.guildName}
      チャンネル: ${data.channelName}
      ユーザー: ${data.username}
      内容: ${data.message}
      リンク: ${msgLink}
    `);
  } catch (e) {
    await message.author.send(`
          ## エラー
          ### 例外が発生しました。
          チャンネル: ${client.channels.cache.get(message.channelId)}
          ログ: \`${e.message}\`
          `);
    await message.react("❎");
  }
});

client.login(TOKEN);
