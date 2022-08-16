const { addEmeralds } = require('../mongoose.js');

module.exports = {
	name: 'messageCreate',
	execute(message) {
		const { emeraldsPerMessage } = require('../json/config.json');
        addEmeralds(message.author.id, emeraldsPerMessage)
	},
};