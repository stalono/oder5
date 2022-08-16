const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser } = require('../mongoose.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Информация о пользователе')
		.addUserOption(option => 
			option.setName('пользователь')
				.setDescription('Пользователь информацию о котором вы желаете получить')
				.setRequired(false))
		.setDefaultMemberPermissions(0),
	async execute(interaction) {
		const choosenUser = interaction.options.getUser('пользователь') || interaction.user;
		const user = await getUser(choosenUser.id);
		const emeraldsEmbed = new MessageEmbed()
			.setTitle(`Информация`)
			.setDescription(`**Пользователь: ${choosenUser}
				- Изумруды: ${user.emeralds}
				- Камень: ${user.stone}
				- Железо: ${user.iron}
				- Золото: ${user.gold}
				- Алмазы: ${user.diamonds}
				- Аметист: ${user.amethyst}**`)
			.setColor('DARK_GREEN')
			.setTimestamp()
			.setFooter({ text: 'Информация' })
		await interaction.reply({ embeds: [emeraldsEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};