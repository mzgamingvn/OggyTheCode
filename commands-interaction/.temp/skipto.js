const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Chuyển đến 1 bài hát')
        .addNumberOption(option => option
            .setName('song')
            .setDescription('Số thứ tự của bài hát')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client

        const queue = client.player.getQueue(interaction.guild)
        let track = Number
        if (interaction.options.getNumber('song') >= 1) track = interaction.options.getNumber('song') - 1
        else if (interaction.options.getNumber('song') == 0) track = interaction.options.getNumber('song')
        if (!queue || !queue.nowPlaying()) return interaction.editReply('🛑 | Hàng chờ đang trống !')
        if (interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.editReply('🛑 | Vui lòng vào chung channel để dùng lệnh!')
        if (!queue.tracks[track]) return interaction.editReply('🛑 | Không tìm thấy bài hát trong hàng chờ !')
        interaction.editReply('⏭ | Sẽ chuyển tới bài: ```' + queue.tracks[track] + '```')
        queue.skipTo(track)
        setTimeout(() => {
            interaction.deleteReply()
        }, 10000);
    }
}