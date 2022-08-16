const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow, Modal, TextInputComponent } = require('discord.js');
const { errorEmbed } = require('../utils.js');
const { getUser } = require('../mongoose.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Отправить сообщение для покупки')
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
        const { rolePrice, voicePrice } = require('../json/config.json');
        const buyEmbed = new MessageEmbed()
            .setTitle('Покупка улучшений')
            .setDescription(`**Покупка улучшений осуществляется с помощью двух кнопок под этим сообщением
                На данный момент к покупке доступны такие улучшения как приватная роль и приватный канал
                Для покупки вам надо нажать на кнопку, далее следовать инструкциям полученными от бота**`)
            .addFields(
                { name: `Приватная роль (${rolePrice} изумрудов)`, value: `**- Название
                    - Цвет (В формате #ffffff)**`},
                { name: `Приватный канал (${voicePrice} изумрудов)`, value: `**- Название
                    - Количество пользователей (1-99)**`}
            )
            .setColor('DARK_GOLD')
        const roleButton = new MessageButton()
            .setCustomId('role')
            .setLabel('Приватная роль')
            .setStyle(1)
        const voiceButton = new MessageButton()
            .setCustomId('voice')
            .setLabel('Приватный канал')    
            .setStyle(4)
        const roleModal = new Modal()
            .setCustomId('roleModal')
            .setTitle('Параметры роли')
            .addComponents(
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('roleName')
                        .setPlaceholder('Текст')
                        .setLabel('Название роли')
                        .setMaxLength(100)
                        .setMinLength(1)
                        .setRequired(true)
                        .setStyle('SHORT'), 
                    ),
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('roleColor')
                        .setPlaceholder('Текст')
                        .setLabel('Цвет роли (В формате #ffffff)')
                        .setMaxLength(7)
                        .setMinLength(7)
                        .setRequired(true)
                        .setStyle('SHORT')
                )
            );
            const voiceModal = new Modal()
                .setCustomId('voiceModal')
                .setTitle('Параметры канала')
                .addComponents(
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('voiceName')
                            .setPlaceholder('Текст')
                            .setLabel('Название канала')
                            .setMaxLength(100)
                            .setMinLength(1)
                            .setRequired(true)
                            .setStyle('SHORT'),
                    ),
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('voiceLimit')
                            .setPlaceholder('Текст')
                            .setLabel('Количество пользователей (1-99)')
                            .setMaxLength(2)
                            .setMinLength(1)
                            .setRequired(true)
                            .setStyle('SHORT')
                    )
                );
        const row = new MessageActionRow()
            .addComponents(roleButton, voiceButton)
        const message = await interaction.channel.send({ embeds: [buyEmbed], components: [row], ephemeral: true }).catch(error => {console.log(error)});
        const filter = (interaction) => interaction.customId === 'role' || interaction.customId === 'voice' || interaction.customId === 'roleModal' || interaction.customId === 'voiceModal';
        const collector = message.createMessageComponentCollector({ filter });
        collector.on('collect', async interaction => {
            const userEMS = await getUser(interaction.user.id);
            const enoughtForRole = userEMS.emeralds >= rolePrice;
            const enoughtForVoice = userEMS.emeralds >= voicePrice;

            if (interaction.customId === 'role') {
                if (enoughtForRole) {
                    await interaction.showModal(roleModal) 
                    return;
                } else {
                    await interaction.reply(errorEmbed('У вас недостаточно изумрудов для покупки этого улучшения'));
                }
            }

            if (interaction.customId === 'voice') {
                if (enoughtForVoice) {
                    await interaction.showModal(voiceModal);
                    return;
                } else {
                    await interaction.reply(errorEmbed('У вас недостаточно изумрудов для покупки этого улучшения'));
                }
            }
        });
	},
    async holdRoleModal(interaction) {
        const { removeEmeralds } = require('../mongoose.js');
        const { rolePrice } = require('../json/config.json');
        const roleName = interaction.fields.getTextInputValue('roleName');
        const roleColor = interaction.fields.getTextInputValue('roleColor');
        if (roleName && roleColor) {
            try {
                const role = await interaction.guild.roles.create({
                    name: `${roleName}`,
                    color: `${roleColor}`,
                    reason: 'Покупа роли',
                })
                const member = await interaction.guild.members.cache.get(interaction.user.id);
                member.roles.add(role);
                const roleEmbed = new MessageEmbed()
                    .setTitle('Покупка Улучшения')
                    .setDescription(`Вы успешно купили приватную роль >> ${role}`)
                    .setColor('DARK_GREEN')
                await interaction.reply({ embeds: [roleEmbed], ephemeral: true });
                await removeEmeralds(interaction.user.id, rolePrice);
            } catch (error) {
                console.log(error)
                await interaction.reply(errorEmbed('Произошла ошибка при покупке роли: ' + error));
            }
        }
    },
    async holdVoiceModal(interaction) {
        const { privateCategoryName, voicePrice } = require('../json/config.json');
        const { removeEmeralds } = require('../mongoose.js');
        const voiceName = interaction.fields.getTextInputValue('voiceName');
        const voiceLimit = interaction.fields.getTextInputValue('voiceLimit');
        if (voiceName && voiceLimit) {
            const categoryOld = await interaction.guild.channels.cache.find(c => c.name === privateCategoryName && c.type === 'GUILD_CATEGORY');
            if (!categoryOld) {
                await interaction.guild.channels.create(privateCategoryName, {
                    type: 'GUILD_CATEGORY',
                    reason: 'Создание категории для приватных каналов',
                });
            }
            const categoryNew = await interaction.guild.channels.cache.find(c => c.name === privateCategoryName && c.type === 'GUILD_CATEGORY');
            try {
                const voice = await interaction.guild.channels.create(voiceName,{
                    type: 'GUILD_VOICE',
                    userLimit: `${voiceLimit}`,
                    reason: 'Покупа канала',
                })
                await voice.setParent(categoryNew);
                const voiceEmbed = new MessageEmbed()
                    .setTitle('Покупка Улучшения')
                    .setDescription(`Вы успешно купили приватный канал >> ${voice}`)
                    .setColor('DARK_GREEN')
                await interaction.reply({ embeds: [voiceEmbed], ephemeral: true });
                await removeEmeralds(interaction.user.id, voicePrice);
            } catch (error) {
                try {
                    await interaction.reply(errorEmbed('Произошла ошибка при покупке канала: ' + error));
                } catch (error) {
                }
            }
        }
    }
};