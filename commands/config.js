const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Измменить конфигурацию бота')
        .addStringOption(option =>
            option.setName('параметр')
                .setDescription('Параметр который вы желаете изменить')
                .setRequired(true)
                .addChoices(
                    { name: 'Изумрудов за сообщение', value: 'msg' },
                    { name: 'Множитель за Камень', value: 'stone' },
                    { name: 'Множитель за Железо', value: 'iron' },
                    { name: 'Множитель за Золото', value: 'gold' },
                    { name: 'Множитель за Алмазы', value: 'diamonds' },
                    { name: 'Множитель за Аметист', value: 'amethyst' },
                    { name: 'Процент Каменя в шахте', value: 'stoneC' },
                    { name: 'Процент Железа в шахте', value: 'ironC' },
                    { name: 'Процент Золота в шахте', value: 'goldC' },
                    { name: 'Процент Алмазов в шахте', value: 'diamondsC' },
                    { name: 'Процент Аметиста в шахте', value: 'amethystC' },
                    { name: 'КД на добычу в шахте', value: 'cd' },
                    { name: 'Цена за роль', value: 'role' },
                    { name: 'Цена за канал', value: 'channel' },
                    { name: 'Название категории с кананалами', value: 'channelName' },
                )
        )
        .addIntegerOption(option =>
            option.setName('значние')
                .setDescription('Множитель')
                .setRequired(true))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
        const config = require('../json/config.json');
        const command = interaction.options.getString('параметр');
        const amount = interaction.options.getInteger('значние');
        switch (command) {
            case 'msg':
                config.emeraldsPerMessage = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'iron':
                config.mults.iron = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'stone':
                config.mults.stone = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'gold':
                config.mults.gold = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'diamonds':
                config.mults.diamonds = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'amethyst':
                config.mults.amethyst = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'stoneC':
                config.chances[0].chance = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'ironC':
                config.chances[1].chance = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'goldC':
                config.chances[2].chance = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'diamondsC':
                config.chances[3].chance = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'amethystC':
                config.chances[4].chance = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'cd':
                config.mineTimeout = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'role':
                config.rolePrice = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'channel':
                config.voicePrice = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
            case 'channelName':
                config.privateCategoryName = amount;
                fs.writeFileSync('./json/config.json', JSON.stringify(config));
                break;
        }
        await interaction.reply({ embeds: [new MessageEmbed().setTitle(`**Значение ${command} успешно изменено на ${amount}**`).setColor('DARK_RED')], ephemeral: true }).catch(err => console.log(err));
	},
};