const { SlashCommandBuilder } = require('@discordjs/builders');
const { rouletEmbed, internalRow, externalRow, numbersSelectModal, lineSelectModal, packSelect, betSelectModal, resultEmbed } = require('../embeds/roulet-embed.js');
const { columns, dozens, lines, corners, colors } = require('../matrixes.js');
const { addEmeralds, removeEmeralds, getUser } = require('../mongoose.js')

async function validateBet(bet, id) {
	const tokenss = await getUser(id);
    const tokens = tokenss.emeralds;
	if (bet < 1 || !Number(bet) || bet > tokens) {
		return false;
	}
	return true;
}

function processRouletInteracrion(interaction, numbers, price, type) {
	const result = Math.floor(Math.random() * 36) + 1;
	var reward = 0;
	var bet = Number(price);
	var win = false;
	if (type === 'corners') {
		numbers = corners;
		win = numbers.includes(result);
		reward = win ? bet * 8 : bet;
	}
	if (type === 'red') {
		numbers = colors[0];
		win = numbers.includes(result);
		reward = win ? bet * 2 : bet;
	}
	if (type === 'black') {
		numbers = colors[1];
		win = numbers.includes(result);
		reward = win ? bet * 2 : bet;
	}
	if (type === 'odd') {
		numbers = [];
		for (let i = 2; i <= 36; i += 2) {
			numbers.push(i);
		}
		win = numbers.includes(result);
		reward = win ? bet * 2 : bet;
	}
	if (type === 'even') {
		numbers = [];
		for (let i = 1; i <= 36; i += 2) {
			numbers.push(i);
		}
		win = numbers.includes(result);
		reward = win ? bet * 2 : bet;
	}
	if (type === 'small') {
		numbers = [];
		for (let i = 1; i <= 18; i++) {
			numbers.push(i);
		}
		win = numbers.includes(result);
		reward = win ? bet * 2 : bet;	
	}
	if (type === 'big') {
		numbers = [];
		for (let i = 19; i <= 36; i++) {
			numbers.push(i);
		}
		win = numbers.includes(result);
		reward = win ? bet * 2 : bet;	
	}
	if (type === 'numbers') {
		win = numbers.includes(result);
		switch (numbers.length) {
			case 1:
				reward = win ? bet * 35 : bet;
				break;
			case 2:
				reward = win ? bet * 17 : bet;
				break;
			case 3:
				reward = win ? bet * 11 : bet;
				break;
		}
	}
	if (type === 'line') {
		const line = lines[Number(numbers)];
		numbers = line;
		win = line.includes(result);
		reward = win ? bet * 5 : bet;
	}
	if (type === 'dozen') {
		const dozen = dozens[Number(numbers)];
		numbers = dozen;
		win = dozen.includes(result);
		reward = win ? bet * 2 : bet;
	}
	if (type === 'column') {
		const column = columns[Number(numbers)];
		numbers = column;
		win = column.includes(result);
		reward = win ? bet * 2 : bet;
	}
	if (numbers.length > 6) {
		numbers = numbers.slice(0, 6);
		numbers.push('...');
	}
	var numbersString = numbers.join(', ');
	numbersString = numbersString.replace(', ...', ' ...');
	if (win) {
		addEmeralds(interaction.user.id, reward);
	} else {
		removeEmeralds(interaction.user.id, bet);
	}
	interaction.reply({embeds: [resultEmbed(win, bet, numbersString, result, reward)], ephemeral: true});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulet')
		.setDescription('Сыграть в рулетку.'),
	async execute(interaction) {
		await interaction.reply({ embeds: [rouletEmbed], components: [internalRow, externalRow], ephemeral: true }).catch(error => {console.log(error);});
	},

	async checkRouletInteraction(interaction) {
		if (interaction.isModalSubmit()) {
			var type = '';
			var numbers = [];
			var fieldsCount = 0;
			for (var i = 0; i < interaction.fields.components.length; i++) {
				fieldsCount++;
			}
			if (interaction.customId === 'betSelectModal') {
				const identifier = interaction.fields.components[0].components[0].customId;
				const type = interaction.fields.components[0].components[0].customId.split('-')[1];
				const bet = interaction.fields.getTextInputValue(identifier);
				if (await validateBet(bet, interaction.user.id)) {
					processRouletInteracrion(interaction, false, bet, type);
				} else {
					interaction.reply({ content: '**Значения которые вы ввели не являются подходящими**', ephemeral: true });
				}
				return;
			} 
			if (!(await validateBet(interaction.fields.getTextInputValue('bet-amount'), interaction.user.id))) {
				interaction.reply({ content: '**Значения которые вы ввели не являются подходящими**', ephemeral: true });
				return;
			}
			}
			for (i = 0; i < (fieldsCount -1); i++) {
				if (interaction.customId === 'numbersSelectModal') {
					const field = Number(interaction.fields.getTextInputValue('number-' + i));
					if ( !field || field > 36 || field <= 0){
						interaction.reply({ content: '**Значения которые вы ввели не являются подходящими**', ephemeral: true });
						return;
					}
					numbers.push(field);
					type = 'numbers';
				}
				if (interaction.customId === 'dozens-select') {
					const field = Number(interaction.fields.getTextInputValue('dozen-input'));
					if ( !field || field > 3 || field <= 0) {
						interaction.reply({ content: '**Значения которые вы ввели не являются подходящими**', ephemeral: true });
						return;
					}
					numbers.push(field);
					type = 'dozen';
				}
				if (interaction.customId === 'column-select') {
					const field = Number(interaction.fields.getTextInputValue('column-input'));
					if ( !field || field > 3 || field <= 0) {
						interaction.reply({ content: '**Значения которые вы ввели не являются подходящими**', ephemeral: true });
						return;
					}
					numbers.push(field);
					type = 'column';
				}
				if (interaction.customId === 'lineSelect') {
					const field = Number(interaction.fields.getTextInputValue('line-input'));
					if ( !field || field > 6 || field <= 0) {
						interaction.reply({ content: '**Значения которые вы ввели не являются подходящими**', ephemeral: true });
						return;
					}
					numbers.push(field);
					type = 'line';
				}
			if (numbers.length === 0) {
				interaction.reply({ content: '**Произошла ошибка, попробуйте снова**', ephemeral: true });
				return;
			}
		}
		processRouletInteracrion(interaction, numbers, interaction.fields.getTextInputValue('bet-amount'), type);
		return;
	},

	holdRouletInteraction(interaction) {
		if (interaction.customId === 'internal-bet') {
			const values = Number(interaction.values);
			switch (values) {
			case 35:
				interaction.showModal(numbersSelectModal(1));
				break;
			case 17:
				interaction.showModal(numbersSelectModal(2));
				break;
			case 11:
				interaction.showModal(numbersSelectModal(3));
				break;
			case 8:
				interaction.showModal(betSelectModal('corners'));
				break;
			case 5:
				interaction.showModal(lineSelectModal).catch(error => {console.log(error);});
				break;
			}
		}
		if (interaction.customId === 'external-bet') {
			
			const values = interaction.values;
			switch (values.toString()) {
			case 'red':
				interaction.showModal(betSelectModal('red'));
				break;
			case 'black':
				interaction.showModal(betSelectModal('black'));
				break;
			case 'odd':
				interaction.showModal(betSelectModal('odd'));
				break;
			case 'even':
				interaction.showModal(betSelectModal('even'));
				break;
			case 'small':
				interaction.showModal(betSelectModal('small'));
				break;
			case 'big':
				interaction.showModal(betSelectModal('big'));
				break;
			case 'dozens':
				interaction.showModal(packSelect('dozens')).catch(error => {console.log(error);});
				break;
			case 'columns':
				interaction.showModal(packSelect('columns')).catch(error => {console.log(error);});
				break;
			}
		}
	},
};