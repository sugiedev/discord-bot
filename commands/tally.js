const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { TALLY_CHANNEL_ID } = require("../const.js");
const getMessages = require("../firebase/getMessages.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tally")
    .setDescription("日報集計用のコマンド")
    .addNumberOption((option) =>
      option
        .setName("date")
        .setDescription("集計した日付を8桁で入力 (例: 20240101)")
        .setRequired(true)
    ),

  execute: async function (interaction) {
    try {
      const date = interaction.options.getNumber("date");
      const dateRegex = /^\d{8}$/;
      const isValid = dateRegex.test(date);
      if (!isValid) {
        await interaction.reply({
          content: "日付の形式が正しくありません。",
          // ephemeral: true,
        });
        return;
      }

      const messages = await getMessages(date);
      if (!messages) {
        await interaction.reply({
          content: `メッセージが存在しません`,
          // ephemeral: true,
        });
        return;
      }

      // const createdChannel = await interaction.guild.channels.create({
      //   type: ChannelType.GuildText,
      //   name: `集計_${date}`,
      //   parent: TALLY_CHANNEL_ID,
      // });
      const tallyChannel = interaction.guild.channels.cache.get(
        "1190502061893222530"
      );

      // let r = [`\`【${date}_社内メッセージ集計】\``];

      // // guildId: message.guildId,
      // // guildName: message.guild?.name,
      // // channelId: message.channel.id,
      // // channelName: message.channel.name,
      // // userId: message.author.id,
      // // username: message.author.username,
      // // createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // // messageId: message.id,
      // // message: message.content,
      // // isValid: true,

      // const msg = messages.map((m) => {
      //   const msgLink = `https://discord.com/channels/${m.guildId}/${m.channelId}/${m.messageId}`;
      //   return `
      //   ${m.username}
      //   ${msgLink}
      //   `;
      // });

      // await tallyChannel.send(t);

      let r = [`\`【${date}_社内メッセージ集計】\``];

      const msg = messages.map((m) => {
        const msgLink = `https://discord.com/channels/${m.guildId}/${m.channelId}/${m.messageId}`;
        return `${m.username}\n${msgLink}`;
      });
      r = r.concat(msg);
      const finalMessage = r.join("\n");
      await tallyChannel.send(finalMessage);

      await interaction.reply({
        content: `チャンネル「${tallyChannel.name}」に${date}の集計を行いました`,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply("チャンネルの作成中にエラーが発生しました。");
    }
  },
};
