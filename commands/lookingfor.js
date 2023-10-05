const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const { groups } = require("./editgroups.js");
const { buildEmbed } = require("../util/buildembed.js");
const { DEBUG } = require("../config.json");

function log(s) {
    console.log(`${new Date()} lookingfor.js: ${s}`);
}

// TODO: make this process use ephemeral embeds where users can click on buttons to join/leave
// if the group fills via button, the embed is destroyed and the full ping message is sent like before
const joinButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel("Join Group")
    .setEmoji("✅")
    .setCustomId("join");

const leaveButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel("Leave Group")
    .setEmoji("❌")
    .setCustomId("leave");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lookingfor")
        .setDescription("Looking for a group? Use this command to find one!")
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("What role are you looking for?")
                .setRequired(true)
        ),
    async execute(interaction) {
        if (DEBUG) {
            log(interaction.user);
            log(interaction.member);
            log(interaction.guild);
            log(interaction.options.getRole("role"));
        }
        let role = interaction.options.getRole("role");

        if (!(role.id in groups)) {
            await interaction.reply({
                content: `There is no group for ${role.name}!`,
                ephemeral: true,
            });
            return;
        }

        let group = groups[role.id];
        if (group.isMember(interaction.member.id)) {
            group.removeMember(interaction.member.id);
            await interaction.reply({
                content: `You were already in ${role.name}, so you've been removed!`,
                embeds: [buildEmbed(interaction, group)],
                ephemeral: true,
            });
        }

        group.addMember(interaction.member.id);
        await interaction.reply({
            content: `Successfully added to ${role.name}!`,
            embeds: [buildEmbed(interaction, group)],
            ephemeral: true,
        });

        // check if full, if so ping all and clear group
        if (group.isFull()) {
            let ping = group.members.map((id) => `<@${id}>`).join(",");
            await interaction.followUp({
                content: `${ping}, ${role.name} is now full! Have fun!\nClearing the group...`,
            });
            group.clear();
        }
    },
};
