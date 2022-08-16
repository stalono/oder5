const { MessageEmbed, MessageActionRow, MessageSelectMenu, Modal, TextInputComponent } = require('discord.js');

const rouletEmbed = new MessageEmbed()
    .setTitle('Рулетка')
    .addFields(
        { name: 'Выберите желаемую ставку', value: '\u200B' },
    )
    .setImage('https://media.discordapp.net/attachments/996695068834549761/996798574992052314/unknown.png')
    .setColor('0x2ecc71');

const internalRow = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('internal-bet')
            .setPlaceholder('Внутренняя ставка')
            .addOptions([
                {
                    label: 'Прямая ставка (x35)',
                    description: '1 номер',
                    value: '35',
                },
                {
                    label: 'Сплит ставка (х17)',
                    description: '2 номера',
                    value: '17',
                },
                {
                    label: 'Стрит ставка (х11)',
                    description: '3 номера',
                    value: '11',
                },
                {
                    label: 'Ставка на углы (x8)',
                    description: '4 номера',
                    value: '8',
                },
                {
                    label: 'Ставка на линию (x5)',
                    description: '6 номеров',
                    value: '5',
                }
            ]),
    );

const externalRow = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('external-bet')
            .setPlaceholder('Внешняя ставка')
            .addOptions([
                {
                    label: 'Ставка на красные (x1)',
                    description: '18 номеров',
                    value: 'red',
                },
                {
                    label: 'Ставка на черные (x1)',
                    description: '18 номеров',
                    value: 'black',
                },
                {
                    label: 'Ставка на чётные (x1)',
                    description: '18 номеров',
                    value: 'odd',
                },
                {
                    label: 'Ставка на нечётные (x1)',
                    description: '18 номеров',
                    value: 'even',
                },
                {
                    label: 'Ставка на малые (1-18) (x1)',
                    description: '18 номеров',
                    value: 'small',
                },
                {
                    label: 'Ставка на большие (19-36) (x1)',
                    description: '18 номеров',
                    value: 'big',
                },
                {
                    label: 'Ставка на 1-3 дюжины (x2)',
                    description: '12 номеров',
                    value: 'dozens',
                },
                {
                    label: 'Ставка на 1-3 колоны (x2)',
                    description: '12 номеров',
                    value: 'columns',
                },
            ])
    );




const lineSelectModal = new Modal()
    .setCustomId('lineSelect')
    .setTitle('Выберите линию')
    .addComponents(
        new MessageActionRow().addComponents(
            new TextInputComponent()
                .setCustomId('line-input')
                .setLabel('Выберите номер линии')
                .setPlaceholder('Число')
                .setMinLength(1)
                .setMaxLength(1)
                .setRequired(true)
                .setStyle('SHORT'),
        ),
        new MessageActionRow().addComponents(
            new TextInputComponent()
                .setCustomId('bet-amount')
                .setPlaceholder('Ставка (Число)')
                .setLabel('Введите ставку')
                .setMaxLength(6)
                .setMinLength(1)
                .setRequired(true)
                .setStyle('SHORT')
        )
    );

function packSelect(pack) {
    if (pack === 'dozens') {
        return new Modal()
            .setCustomId('dozens-select')
            .setTitle('Выберите дюжину')
            .addComponents(
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('dozen-input')
                        .setPlaceholder('Число')
                        .setLabel('Введите номер дюжины')
                        .setMaxLength(1)
                        .setMinLength(1)
                        .setRequired(true)
                        .setStyle('SHORT'), 
                    ),
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('bet-amount')
                        .setPlaceholder('Ставка (Число)')
                        .setLabel('Введите ставку')
                        .setMaxLength(6)
                        .setMinLength(1)
                        .setRequired(true)
                        .setStyle('SHORT')
                )
            );
    } else {
        return new Modal()
            .setCustomId('column-select')
            .setTitle('Выберите колону')
            .addComponents(
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('column-input')
                        .setPlaceholder('Число')
                        .setLabel('Введите номер колоны')
                        .setMaxLength(1)
                        .setMinLength(1)
                        .setRequired(true)
                        .setStyle('SHORT'), 
                    ),
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId('bet-amount')
                        .setPlaceholder('Ставка (Число)')
                        .setLabel('Введите ставку')
                        .setMaxLength(6)
                        .setMinLength(1)
                        .setRequired(true)
                        .setStyle('SHORT')
                )
            );
    }
}

function numbersSelectModal(amount) {
    const modal = new Modal()
        .setCustomId('numbersSelectModal')
        .setTitle('Выберите номер(-а) от 1 до 36');
    for (let i = 0; i < amount; i++) {
        modal.addComponents(
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId('number-' + i)
                    .setPlaceholder('Число')
                    .setLabel('Выберите число')
                    .setMaxLength(2)
                    .setMinLength(1)
                    .setRequired(true)
                    .setStyle('SHORT')
            )
        );
    }
    modal.addComponents(
        new MessageActionRow().addComponents(
            new TextInputComponent()
                .setCustomId('bet-amount')
                .setPlaceholder('Ставка (Число)')
                .setLabel('Введите ставку')
                .setMaxLength(6)
                .setMinLength(1)
                .setRequired(true)
                .setStyle('SHORT')
        )
    );
    return modal;
}

function betSelectModal(type) {
    const modal = new Modal()
        .setCustomId('betSelectModal')
        .setTitle('Выберите ставку');
    modal.addComponents(
        new MessageActionRow().addComponents(
            new TextInputComponent()
                .setCustomId(`bet-${type}`)
                .setPlaceholder('Ставка (Число)')
                .setLabel('Введите ставку')
                .setMaxLength(6)
                .setMinLength(1)
                .setRequired(true)
                .setStyle('SHORT')
        )
    );
    return modal;
}

function resultEmbed(win, bet, input, output, result) {
    if (win) {
        return new MessageEmbed()
            .setTitle('Вы выиграли!')
            .setDescription(
                `**Ставка: ${bet} Токенов(-а)**\n
                **Выпавший номер: ${output}**\n
                **Введенные номера: ${input}**\n
                **Выигрыш: ${result} Изумрудов(-а)**`
            )
            .setColor('0x2ecc71')
    }
    if (!win) {
        return new MessageEmbed()
            .setTitle('Вы проиграли!')
            .setDescription(
                `**Ставка: ${bet} Изумрудов(-а)**\n
                **Выпавший номер: ${output}**\n
                **Введенные номера: ${input}**\n`
            )
            .setColor('0x992d22')
    }
}

module.exports = { rouletEmbed, internalRow, externalRow, numbersSelectModal, lineSelectModal, packSelect, resultEmbed, betSelectModal };