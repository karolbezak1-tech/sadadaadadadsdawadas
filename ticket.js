const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionFlagsBits, 
    ChannelType, 
    AttachmentBuilder 
} = require('discord.js');

module.exports = {
    init: (client) => {
        // --- KONFIGURACJA KATEGORII I RÓL ---
        const TICKET_CONFIG = {
            'pomoc': {
                categoryId: '1470375851773399160',
                roles: ['1469658211933093945', '1469658211933093942'],
                label: 'Pomoc',
                question: 'W czym możemy pomóc?'
            },
            'wspolpraca': {
                categoryId: '1470375947831345325',
                roles: ['1469658211933093945'],
                label: 'Współpraca',
                question: 'Z kim współpraca i jaka?'
            },
            'link': {
                categoryId: '1470376157781164214',
                roles: ['1470376926853075045', '1469658211933093945'],
                label: 'Znajdź link',
                question: 'Do czego chcesz link i jaki batch?'
            },
            'inne': {
                categoryId: '1470376241616912436',
                roles: ['1469658211933093945', '1469658211933093942'],
                label: 'Inne',
                question: 'W czym możemy pomóc?'
            }
        };

        const LOG_CHANNEL_ID = '1470377707828416553';

        // --- GŁÓWNY HANDLER INTERAKCJI ---
        client.on('interactionCreate', async (interaction) => {
            
            // 1. KOMENDA /ticket-panel
            if (interaction.isChatInputCommand() && interaction.commandName === 'ticket-panel') {
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.reply({ content: 'Brak uprawnień.', ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle('🎫 CENTRUM TICKETÓW LUCKYREPS')
                    .setDescription('Wybierz z listy poniżej kategorię, która najlepiej opisuje Twój problem.\n\nNasza administracja postara się pomóc najszybciej jak to możliwe.')
                    .setColor('#FFFFFF')
                    .setImage('https://cdn.discordapp.com/attachments/1469777712028713103/1470378521917395075/image.png?ex=698b1435&is=6989c2b5&hm=dc702a32298204bf84be9021f77deffce7d69b8041a0b1c1d04f156edeee342e') // Wklej tu swój banner
                    .setFooter({ text: 'LuckyReps 2026 | Support System' });

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('ticket_select')
                    .setPlaceholder('Wybierz kategorię zgłoszenia...')
                    .addOptions([
                        { label: 'Pomoc', description: 'Problemy techniczne, pytania', value: 'pomoc', emoji: '❓' },
                        { label: 'Współpraca', description: 'Oferty współpracy, reklama', value: 'wspolpraca', emoji: '🤝' },
                        { label: 'Znajdź link', description: 'Pomoc w znalezieniu przedmiotu (W2C)', value: 'link', emoji: '🔍' },
                        { label: 'Inne', description: 'Pozostałe sprawy', value: 'inne', emoji: '📂' },
                    ]);

                const row = new ActionRowBuilder().addComponents(selectMenu);

                await interaction.reply({ content: '> Panel biletowy wysłany!', ephemeral: true });
                await interaction.channel.send({ embeds: [embed], components: [row] });
            }

            // 2. OBSŁUGA WYBORU Z MENU (POKAZANIE MODALA)
            if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
                const selectedValue = interaction.values[0];
                const config = TICKET_CONFIG[selectedValue];

                if (!config) return;

                const modal = new ModalBuilder()
                    .setCustomId(`modal_ticket_${selectedValue}`)
                    .setTitle(`Zgłoszenie: ${config.label}`);

                const input = new TextInputBuilder()
                    .setCustomId('ticket_reason')
                    .setLabel(config.question) // Pytanie z konfiguracji
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const firstActionRow = new ActionRowBuilder().addComponents(input);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);
            }

            // 3. OBSŁUGA WYSŁANIA MODALA (STWORZENIE KANAŁU)
            if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_ticket_')) {
                // Wyciągamy kategorię z ID modala (np. modal_ticket_pomoc -> pomoc)
                const categoryKey = interaction.customId.replace('modal_ticket_', '');
                const config = TICKET_CONFIG[categoryKey];
                const reason = interaction.fields.getTextInputValue('ticket_reason');
                
                // Opóźnienie odpowiedzi (żeby uniknąć błędu 3 sekund)
                await interaction.deferReply({ ephemeral: true });

                const guild = interaction.guild;
                const user = interaction.user;

                // Konfiguracja uprawnień kanału
                const permissionOverwrites = [
                    {
                        id: guild.id, // @everyone - blokada
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: user.id, // Twórca biletu - dostęp
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
                    },
                    {
                        id: client.user.id, // Bot - pełny dostęp
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
                    }
                ];

                // Dodawanie ról administracyjnych
                config.roles.forEach(roleId => {
                    permissionOverwrites.push({
                        id: roleId,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    });
                });

                try {
                    // Tworzenie kanału
                    const ticketChannel = await guild.channels.create({
                        name: `🎟️-ticket-${config.label}-${user.username}`,
                        type: ChannelType.GuildText,
                        parent: config.categoryId,
                        permissionOverwrites: permissionOverwrites,
                    });

                    // Embed wewnątrz biletu
                    const ticketEmbed = new EmbedBuilder()
                        .setTitle(`Nowe Zgłoszenie: ${config.label}`)
                        .setDescription(
                            `Witaj ${user}! Administratorzy zostali powiadomieni.\n` +
                            `Odpowiemy na Twoje zgłoszenie w ciągu **24h**.\n\n` +
                            `👤 **Osoba otwierająca:** <@${user.id}>\n` +
                            `📝 **Powód:** \`${reason}\`\n` +
                            `⏰ **Godzina otwarcia:** <t:${Math.floor(Date.now() / 1000)}:F>\n` +
                            `📂 **Kategoria:** ${config.label}`
                        )
                        .setColor('#FFFFFF');

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('🔒 Zamknij bilet')
                        .setStyle(ButtonStyle.Danger);

                    const row = new ActionRowBuilder().addComponents(closeButton);

                    await ticketChannel.send({ 
                        content: `<@${user.id}> | ${config.roles.map(r => `<@&${r}>`).join(' ')}`, 
                        embeds: [ticketEmbed], 
                        components: [row] 
                    });

                    await interaction.editReply({ content: `Twój bilet został utworzony: ${ticketChannel}` });

                    // Log otwarcia na kanale logów
                    const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);
                    if (logChannel) {
                        logChannel.send({ content: `> 🟢 **Nowy bilet:** ${ticketChannel.name} przez ${user.tag} (Powód: ${reason})` });
                    }

                } catch (error) {
                    console.error('Błąd tworzenia biletu:', error);
                    await interaction.editReply({ content: 'Wystąpił błąd podczas tworzenia kanału. Sprawdź uprawnienia bota lub ID kategorii.' });
                }
            }

            // 4. OBSŁUGA ZAMYKANIA BILETU I TRANSKRYPCJA
            if (interaction.isButton() && interaction.customId === 'close_ticket') {
                const channel = interaction.channel;
                
                await interaction.reply({ content: 'Zamykanie biletu i generowanie transkryptu...', ephemeral: true });

                // Pobieranie wiadomości do transkryptu
                let messages = [];
                try {
                    messages = await channel.messages.fetch({ limit: 100 });
                } catch (e) {
                    console.error('Błąd pobierania wiadomości:', e);
                }

                // Formatowanie treści pliku .txt
                const transcriptContent = Array.from(messages.values())
                    .reverse() // Od najstarszej do najnowszej
                    .map(m => `[${m.createdAt.toLocaleString()}] ${m.author.tag}: ${m.content} ${m.attachments.size > 0 ? '(Załącznik)' : ''}`)
                    .join('\n');

                const buffer = Buffer.from(transcriptContent, 'utf-8');
                const attachment = new AttachmentBuilder(buffer, { name: `transcript-${channel.name}.txt` });

                // Wysłanie loga na kanał logów
                const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('🔴 Bilet Zamknięty')
                        .addFields(
                            { name: 'Kanał', value: channel.name, inline: true },
                            { name: 'Zamknął', value: interaction.user.tag, inline: true },
                            { name: 'Data', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                        )
                        .setColor('#FF0000');
                    
                    await logChannel.send({ embeds: [logEmbed], files: [attachment] });
                }

                // Usunięcie kanału po 5 sekundach
                setTimeout(() => channel.delete().catch(console.error), 5000);
            }
        });
    }
};
