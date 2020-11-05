module.exports = {
	name: 'args-info',
	description: 'arguments info debug',
	usage: '<user> <role>',
	args: true,
	cooldown: 5,
	execute(message, args) {


		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}
		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
}