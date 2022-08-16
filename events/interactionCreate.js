const { holdRouletInteraction, checkRouletInteraction } = require('../commands/roulet.js');
const { holdRoleModal, holdVoiceModal } = require('../commands/buy.js');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (interaction.customId) {
			if (interaction.customId === 'roleModal') {
				holdRoleModal(interaction);
				return;
			} else if (interaction.customId === 'voiceModal') {
				holdVoiceModal(interaction);
				return;
			}
		}
		if (interaction.isModalSubmit()) {
			checkRouletInteraction(interaction);
		}
		if (interaction.isSelectMenu()) {
			try {
				holdRouletInteraction(interaction);
			}
			catch (error) {
				console.log(error);
			}
		}
		if(interaction.isButton()) {
			if(interaction.customId == 'duel') {
				interaction.component.setDisabled(true);
			}
		}
		if (!interaction.isCommand() && !interaction.isMessageContextMenu()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: '**При запуске команды произошла ошибка!**', ephemeral: true });
		}

		if (command.permission) {
			const authorPerms = interaction.channel.permissionsFor(interaction.member);
			if (!authorPerms || !authorPerms.has(command.permission)) {
				const { adminNoRulesMesssage } = require('../json/config.json');
        		interaction.reply({content: adminNoRulesMesssage, ephemeral: true }).catch(error => {console.log(error)});
			}
		}
	},
};