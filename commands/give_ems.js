const { SlashCommandBuilder } = require('@discordjs/builders');
const { addEmeralds } = require('../mongoose.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give_ems')
		.setDescription('Выдать изумруды')
		.addUserOption(option => 
			option.setName('пользователь')
				.setDescription('Пользователь которому вы желаете выдать изумруды')
				.setRequired(true))
        .addIntegerOption(option =>
            option.setName('количество')
                .setDescription('Количество изумрудов которые вы хотите передать')
                .setRequired(true))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
		const choosenUser = interaction.options.getUser('пользователь') || interaction.user;
        const amount = interaction.options.getInteger('количество') || 0;
        await addEmeralds(choosenUser.id, amount);
        const sendEmbed = new MessageEmbed()
            .setTitle(`Вы успешно выдали изумруды`)
            .setDescription(`**Пользователь: ${choosenUser}
                - Отравитель: ${interaction.user}
                - Количество: ${amount}**`)
            .setColor('DARK_RED')
            .setTimestamp()
            .setFooter({ text: 'Админ' })
		await interaction.reply({ embeds: [sendEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};