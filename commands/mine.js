const { SlashCommandBuilder } = require('@discordjs/builders');
const { addEmeralds, addOre } = require('../mongoose.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { getRandom } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
      .setName('mine')
      .setDescription('Копать шахту')
      .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const links = {
          'amethyst': 'https://i.imgur.com/bfQWhCz.png',
          'diamond': 'https://i.imgur.com/Aj19GOk.png',
          'gold': 'https://i.imgur.com/ES38e2W.png',
          'iron': 'https://i.imgur.com/hx2RBDe.png',
          'stone': 'https://static.planetminecraft.com/files/image/minecraft/texture-pack/2021/040/14099954-grimrock_l.webp',
      }
      const names = {
        'amethyst': 'Аметист',
        'diamond': 'Алмаз',
        'gold': 'Золото',
        'iron': 'Железо',
        'stone': 'Камень',
      }
      async function main(interaction) {
          const { mults, chances, emeraldsPerMessage, mineTimeout } = require('../json/config.json')
          const block = await addOre(getRandom(chances), interaction.user.id);
          const win = emeraldsPerMessage * mults[block];
          const balance = await addEmeralds(interaction.user.id, win);
          const mineEmbed = new MessageEmbed()
              .setTitle(`Шахта`)
              .setDescription(`**Вы нашли: ${names[block]}
              Стоимость: ${win}
              Баланс: ${balance.emeralds} ем**`)
              .setColor('DARK_RED')
              .setThumbnail(links[block])
          const mineButton = new MessageButton()
              .setCustomId('mine')
              .setLabel('Копать дальше')
              .setStyle('PRIMARY')
          const mineActionRow = new MessageActionRow()
              .addComponents(mineButton)
            if (interaction.isCommand()) {
              await interaction.reply({ embeds: [mineEmbed], components: [mineActionRow], ephemeral: true }).catch(error => {console.log(error)});
            } else {
              const mineActionRow = new MessageActionRow()
                  .addComponents(new MessageButton()
                      .setCustomId('mine')
                      .setLabel('Копаем...')
                      .setStyle('PRIMARY')
                      .setDisabled(true))
              await interaction.update({ components: [mineActionRow], ephemeral: true }).catch(error => {console.log(error)});
              setTimeout(async () => {
                const mineActionRow = new MessageActionRow()
                  .addComponents(new MessageButton()
                      .setCustomId('mine')
                      .setLabel('Копать дальше')
                      .setStyle('PRIMARY'))
                await interaction.editReply({ embeds: [mineEmbed], components: [mineActionRow], ephemeral: true }).catch(error => {console.log(error)});
              }, mineTimeout * 1000);
            }
            const prevInteraction = interaction
            const message = await prevInteraction.fetchReply();
            const filter = (interaction) => interaction.customId === 'mine' && interaction.user === prevInteraction.user;
            const collector = message.createMessageComponentCollector({ filter, max: 1, time: 60000 }) 
            collector.on('collect', async (interaction) => {
                await main(interaction);
            })
        }
        await main(interaction);
    }
};