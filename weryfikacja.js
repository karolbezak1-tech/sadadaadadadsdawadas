const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    init: (client) => {
        // ID roli wpisane na sztywno
        const ROLE_ID = '1469658211396091960';

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'weryfikacja-panel') {
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.reply({ content: 'Tylko administrator może to zrobić.', ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle('WERYFIKACJA UŻYTKOWNIKA')
                    .setDescription('Kliknij reakcję ✅ poniżej, aby otrzymać dostęp do reszty kanałów.')
                    .setColor('#FFFFFF') // Biały kolor
                    .setImage('https://cdn.discordapp.com/attachments/1469777712028713103/1469778783555813650/image.png?ex=6988e5a9&is=69879429&hm=d1771cb64bd90d69865522eb0bedb44019c43224416de73d233e54688c454081') // Wklej link do zdjęcia
                    .setFooter({ text: 'System Weryfikacji | LuckyReps' })
                    .setTimestamp();

                // Odpowiedź widoczna tylko dla Ciebie (ukrywa użycie komendy przed innymi)
                await interaction.reply({ content: '> **Panel został wysłany!**', ephemeral: true });

                // Wysłanie czystego panelu na kanał
                const message = await interaction.channel.send({ embeds: [embed] });
                await message.react('✅');
            }
        });

        client.on('messageReactionAdd', async (reaction, user) => {
            if (user.bot) return;

            if (reaction.partial) {
                try {
                    await reaction.fetch();
                } catch (error) {
                    return console.error('Błąd pobierania reakcji:', error);
                }
            }

            if (reaction.emoji.name !== '✅') return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(ROLE_ID);

            if (role && member) {
                try {
                    // Bot tylko nadaje rolę, nie wysyła wiadomości PV
                    await member.roles.add(role);
                    console.log(`Pomyślnie zweryfikowano: ${user.tag}`);
                } catch (e) {
                    console.error('Błąd podczas nadawania roli:', e);
                }
            }
        });
    }
};
