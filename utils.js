const { MessageEmbed } = require('discord.js');

function errorEmbed(error) {
    return {embeds: [ new MessageEmbed()
        .setTitle('Ошибка')
        .setDescription(`**${error}**`)
        .setColor('RED')
        .setTimestamp()
        .setFooter({ text: 'Ошибка' }) 
    ], ephemeral: true} 
}

async function sendDM(interaction, embed, id) {
    const user = await interaction.guild.members.cache.get(id);
    const dm = await user.createDM();
    await dm.send({embeds: [embed]});
    await user.deleteDM();
}

function getRandom(list) {
    var array = [];
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var chance = item.chance / 10;
      for (var j = 0; j < chance; j++) {
        array.push(item.type);
      }
    }
    var idx = Math.floor(Math.random() * array.length);
    return array[idx];
}

module.exports = { errorEmbed, sendDM, getRandom };