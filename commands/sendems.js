const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser, addEmeralds, removeEmeralds } = require('../mongoose.js');
const { MessageEmbed } = require('discord.js');
const { errorEmbed } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sendems')
		.setDescription('Передать изумруды')
		.addUserOption(option => 
			option.setName('пользователь')
				.setDescription('Пользователь которому вы желаете передать изумруды')
				.setRequired(true))
        .addIntegerOption(option =>
            option.setName('количество')
                .setDescription('Количество изумрудов которые вы хотите передать')
                .setRequired(true))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
		const choosenUser = interaction.options.getUser('пользователь') || interaction.user;
        const amount = interaction.options.getInteger('количество') || 0;
		const user = await getUser(interaction.user.id);
        if (amount > user.emeralds) {
            await interaction.reply(errorEmbed('У вас недостаточно изумрудов')).catch(error => {console.log(error)});
            return;
        }
        await removeEmeralds(interaction.user.id, amount);
        await addEmeralds(choosenUser.id, amount);
        const sendEmbed = new MessageEmbed()
            .setTitle(`Вы успешно передали изумруды`)
            .setDescription(`**Пользователь: ${choosenUser}
                - Отравитель: ${interaction.user}
                - Количество: ${amount}
                - Остаток: ${user.emeralds - amount}**`)
            .setColor('DARK_GREEN')
            .setTimestamp()
            .setFooter({ text: 'Изумруды' })
		await interaction.reply({ embeds: [sendEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};