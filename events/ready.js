const { syncCommands } = require('../deploy-commands.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Готово! v2.1`);
        syncCommands();
	},
};