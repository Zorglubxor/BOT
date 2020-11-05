const Discord = require('discord.js')
const config = require('./config.json');
const { prefix, token } = require('./config.json');
const fs = require('fs');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();



const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}



bot.once('ready', () => {
    console.log("Ok prêt!")
})
bot.login(token)


function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return bot.users.cache.get(mention);
    }
}

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).trim().split('/ +/');
    const commandName = args.shift().toLowerCase();
    
    if (!bot.commands.has(commandName)) return;
    const command = bot.commands.get(commandName);
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }
    if (!cooldowns.has(command.name)) {
     cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

   
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        
           	if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
             }
        
            return message.channel.send(reply);
    }
 })


    