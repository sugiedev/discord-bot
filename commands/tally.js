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

      const createdChannel = await interaction.guild.channels.create({
        type: ChannelType.GuildText,
        name: `集計_${date}`,
        parent: TALLY_CHANNEL_ID,
      });

      await createdChannel.send(messages[0]?.messageId);

      // await interaction.reply({
      //   content: `チャンネル「${createdChannel.name}」を作成しました。`,
      //   // ephemeral: true,
      // });
    } catch (error) {
      console.error(error);
      await interaction.reply("チャンネルの作成中にエラーが発生しました。");
    }
  },
};
