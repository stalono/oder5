const { SlashCommandBuilder } = require('@discordjs/builders');
const { removeEmeralds } = require('../mongoose.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove_ems')
		.setDescription('Отнять эмеральды')
		.addUserOption(option => 
			option.setName('пользователь')
				.setDescription('Пользователь которому вы желаете удалить изумруды')
				.setRequired(true))
        .addIntegerOption(option =>
            option.setName('количество')
                .setDescription('Количество изумрудов которые вы хотите удалить')
                .setRequired(true))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
		const choosenUser = interaction.options.getUser('пользователь') || interaction.user;
        const amount = interaction.options.getInteger('количество') || 0;
        await removeEmeralds(choosenUser.id, amount);
        const sendEmbed = new MessageEmbed()
            .setTitle(`Вы успешно отняли изумруды`)
            .setDescription(`**Пользователь: ${choosenUser}
                - Отравитель: ${interaction.user}
                - Количество: ${amount}**`)
            .setColor('DARK_RED')
            .setTimestamp()
            .setFooter({ text: 'Админ' })
		await interaction.reply({ embeds: [sendEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};