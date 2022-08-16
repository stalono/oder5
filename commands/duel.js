const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser, addEmeralds, removeEmeralds } = require('../mongoose.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { errorEmbed } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('duel')
		.setDescription('Вызвать игрока на дуель')
		.addUserOption(option => 
			option.setName('пользователь')
				.setDescription('Пользователь которого вы желаете вызвать на дуель')
				.setRequired(true))
        .addIntegerOption(option =>
            option.setName('ставка')
                .setDescription('Ставка')
                .setRequired(true))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
		const choosenUser = interaction.options.getUser('пользователь') || interaction.user;
        const amount = interaction.options.getInteger('ставка') || 0;
		const user = await getUser(interaction.user.id);
        if (amount > user.emeralds) {
            await interaction.reply(errorEmbed('У вас недостаточно изумрудов')).catch(error => {console.log(error)});
            return;
        }
        const duelEmbed = new MessageEmbed()
            .setTitle('Дуэль')
            .setDescription(`**Пользователь ${interaction.user} вызвал на дуэль ${choosenUser}!\n
                Время на регистрацию 30 секунд!
                Для участия нажмите на кнопку под этим сообщением**`)
            .addFields(
                { name: 'Стоимость участия', value: `\`${amount} изумрудов\`` },
            )
            .setTimestamp()
            .setFooter({ text: '' })

        const duelButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('duel')
                    .setLabel('Участвовать')
                    .setStyle('PRIMARY')
            )
		await interaction.reply({ embeds: [duelEmbed], components: [duelButton] }).catch(error => {console.log(error)});
        const message = await interaction.fetchReply();
        const filter = (interaction) => interaction.customId === 'duel' && interaction.user === choosenUser;
        const collector = message.createMessageComponentCollector({ filter, max: 1, time: 30000 });
        collector.on('collect', async (interaction) => {
            const user = await getUser(interaction.user.id);    
            if (amount > user.emeralds) {
                await interaction.reply(errorEmbed('У вас недостаточно изумрудов')).catch(error => {console.log(error)});
                return;
            }

            const randomNum = Math.floor(Math.random() * 2);
            const userWon = randomNum === 0;

            if(userWon) {
                await addEmeralds(interaction.user.id, amount);
                await removeEmeralds(choosenUser.id, amount);
                const winEmbed = new MessageEmbed()
                    .setTitle('Результат')
                    .setDescription(`**Победитель: ${interaction.user}
                    Проигравший: ${choosenUser}
                    Ставка: ${amount} изумрудов**`)
                    .setTimestamp()
                    .setFooter({ text: 'Дуэль' })
                    .setColor('PURPLE')
                await interaction.reply({ embeds: [winEmbed] }).catch(error => {console.log(error)});
            } else {
                await addEmeralds(choosenUser.id, amount);
                await removeEmeralds(interaction.user.id, amount);
                const winEmbed = new MessageEmbed()
                    .setTitle('Результат')
                    .setDescription(`**Победитель: ${choosenUser}
                    Проигравший: ${interaction.user}
                    Ставка: ${amount} изумрудов**`)
                    .setTimestamp()
                    .setFooter({ text: 'Дуэль' })
                    .setColor('PURPLE')
                await interaction.reply({ embeds: [winEmbed] }).catch(error => {console.log(error)});
            }
        });
	},
};