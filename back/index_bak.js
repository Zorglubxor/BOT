const Discord = require('discord.js')
const config = require('./config.json');
const { prefix, token } = require('./config.json');
const fs = require('fs');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();


bot.once('ready',  () =>{
   console.log("Ok prêt!")
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}


bot.login(token)
//new Discord.User(clientdata);

//channel.send('hello!')
    //.then(message => console.log(`Sent message: ${message.content}`))
   // .catch(console.error);

//message.mentions.members.first();
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
    
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    
    if (command === 'args-info') {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
        // args.forEach(function (item, index, array) {
            //message.channel.send(item);
         //   message.channel.send(`argument ${index} : ${item}`);

        //});

     }
     else if (command === 'kick') {
           // grab the "first" mentioned user from the message
           // this will return a `User` object, just like `message.author`
       const taggedUser = message.mentions.users.first();
        message.channel.send(`You wanted to kick: ${taggedUser.username}`);
        message.channel.send(`You wanted to kick: ${taggedUser.id}`);
        message.guild.member(taggedUser).kick('ta mère en short')
        

    }
    else if (command === 'ban1') {
        const taggedUser = message.mentions.users.first();
        message.guild.member(taggedUser).ban({ days: 1, reason: 'Ban pour un jour ' });
        message.channel.send(`Ban de ${taggedUser.username} ...de toute façon c est un naze`);

           
    }
    else if (command === 'ban') {
        if (args.length < 2) {
            return message.reply('Please mention the user you want to ban and specify a ban reason.');
        }

        const user = getUserFromMention(args[0]);
        if (!user) {
            return message.reply('Please use a proper mention if you want to ban someone.');
        }

        const reason = args.slice(1).join(' ');
        try {
            message.guild.members.ban(user, {reason});
        } catch (error) {
            return message.channel.send(`Failed **${user.tag}** est toujours là: ${error}`);
        }

        return message.channel.send(`Youhou **${user}**  va se calmer un peu !`);
    }

    

   else if (message.content === `${prefix}server`) {
        //message.channel.send(`This server's name is: ${message.guild.name}`);
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\n Créée le: ${message.guild.createdAt}`);
    }
    else if (message.content === `${prefix}user-info`) {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);

    }

  

})


    