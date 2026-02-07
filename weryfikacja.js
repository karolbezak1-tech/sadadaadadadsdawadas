const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    init: (client) => {
        // Obsługa komendy /weryfikacja-panel
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'weryfikacja-panel') {
                // Sprawdzenie uprawnień
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.reply({ content: 'Tylko administrator może użyć tej komendy.', ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle('WERYFIKACJA UŻYTKOWNIKA')
                    .setDescription('Kliknij reakcję ✅ poniżej, aby otrzymać rolę i dostęp do reszty kanałów.')
                    .setColor('#FFFFFF') // Biały kolor
                    .setImage('https://cdn.discordapp.com/attachments/1469777712028713103/1469778783555813650/image.png?ex=6988e5a9&is=69879429&hm=d1771cb64bd90d69865522eb0bedb44019c43224416de73d233e54688c454081') // Link bezpośrednio w kodzie
                    .setFooter({ text: 'System Weryfikacji | zaznacz reakcje' })
                    .setTimestamp();

                await interaction.reply({ content: 'Panel został wysłany!', ephemeral: true });
                
                const message = await interaction.channel.send({ embeds: [embed] });
                await message.react('✅');
            }
        });

        // Obsługa reakcji
        client.on('messageReactionAdd', async (reaction, user) => {
            // Ignoruj reakcje bota
            if (user.bot) return;

            // Jeśli wiadomość jest niepełna (starsza), pobierz ją
            if (reaction.partial) {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Błąd podczas pobierania reakcji:', error);
                    return;
                }
            }

            // Sprawdzenie czy to odpowiednie emoji
            if (reaction.emoji.name !== '✅') return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const roleId = process.env.ROLE_ID; // ID roli zostawiamy w ENV, bo tak jest bezpieczniej
            const role = guild.roles.cache.get(roleId);

            if (role && member) {
                try {
                    await member.roles.add(role);
                    console.log(`Nadano rolę użytkownikowi ${user.tag}`);
                    
                    // Tutaj w następnym kroku dodamy wiadomość PV
                } catch (e) {
                    console.error('Błąd: Nie można nadać roli. Sprawdź hierarchię ról bota.');
                }
            }
        });
    }
};
