const { EmbedBuilder } = require('discord.js');

module.exports = {
    init: (client) => {
        // ID kanału powitań
        const WELCOME_CHANNEL_ID = '1469660259277606964';

        client.on('guildMemberAdd', async (member) => {
            // Znajdź kanał powitań
            const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
            if (!channel) return console.log('[BŁĄD] Nie znaleziono kanału powitań!');

            // Obliczanie timestampu (czasu wejścia)
            const joinedTime = Math.floor(member.joinedTimestamp / 1000);

            // Tworzenie bogatego embeda
            const embed = new EmbedBuilder()
                .setTitle(`👋 Witaj w serwerze LuckyReps!`)
                .setDescription(`Cześć ${member}! Cieszymy się, że do nas dołączyłeś.`)
                .addFields(
                    { 
                        name: '🕒 Dołączyłeś o:', 
                        value: `<t:${joinedTime}:F> (<t:${joinedTime}:R>)`, 
                        inline: true 
                    },
                    { 
                        name: '👥 Jest nas już:', 
                        value: `**${member.guild.memberCount}** członków`, 
                        inline: true 
                    },
                    { 
                        name: '🎁 PREZENT NA START', 
                        value: `>>> Pamiętaj aby użyć kodu **\`lucky8\`**\nOtrzymasz **15$ na wysyłkę**!` 
                    }
                )
                .setColor('#FFFFFF') // Biały kolor
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 })) // Avatar użytkownika
                .setImage('https://cdn.discordapp.com/attachments/1469777712028713103/1470008373347876908/image.png?ex=6989bb7b&is=698869fb&hm=758c35a87f265feeafadecbc74b16daf20bb977ef28ebc49ce49c50ddcfc7c2d') // Twój duży obrazek
                .setFooter({ text: 'LuckyReps • Witamy!' })
                .setTimestamp();

            // Wysłanie wiadomości
            try {
                await channel.send({ content: `Hej ${member}, sprawdź to! 👇`, embeds: [embed] });
            } catch (error) {
                console.error('[BŁĄD] Nie udało się wysłać powitania:', error);
            }
        });
    }
};
