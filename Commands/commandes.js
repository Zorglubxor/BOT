const { prefix } = require('../config.json');
module.exports = {
	name: 'commandes',
	description: 'Toutes les commandes du Bot.',
	//aliases: ['commands'],
	usage: '[command name]',
	cooldowns: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Toutes mes commandes:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nenvoyez \`${prefix}commandes [command name]\` pour info spécifique sur cette commande!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('C\'est dans tes DM');
				})
				.catch(error => {
					console.error(`Erreur sur DM  ${message.author.tag}.\n`, error);
					message.reply('Erreur, DMs disabled???');
				});
		}
		const name = args[0].toLowerCase();
		//const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};