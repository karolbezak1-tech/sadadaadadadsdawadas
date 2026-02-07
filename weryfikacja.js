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
                    .setImage('TUTAJ_WKLEJ_LINK_DO_ZDJECIA') // Wpisz link do zdjęcia między cudzysłów
                    .setFooter({ text: 'System Weryfikacji' })
                    .setTimestamp();

                await interaction.reply({ content: 'Panel został wysłany!', ephemeral: true });
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
                    await member.roles.add(role);
                    
                    // Profesjonalna biała wiadomość PV
                    const dmEmbed = new EmbedBuilder()
                        .setTitle('Weryfikacja zakończona sukcesem!')
                        .setDescription(`Otrzymałeś dostęp do serwera **${guild.name}**.`)
                        .setColor('#FFFFFF')
                        .setTimestamp();

                    await member.send({ embeds: [dmEmbed] }).catch(() => {
                        console.log(`Nie udało się wysłać PV do ${user.tag} (zablokowane wiadomości).`);
                    });
                } catch (e) {
                    console.error('Błąd podczas nadawania roli:', e);
                }
            }
        });
    }
};
