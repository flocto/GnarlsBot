const { SlashCommandBuilder } = require("discord.js");
const { groups } = require("./editgroups.js");
const { buildEmbed } = require("../util/buildembed.js");
const { DEBUG } = require("../config.json");

function log(s) {
    console.log(`${new Date()} lookingfor.js: ${s}`);
}

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
            await interaction.reply(`${role.name} is not a group!`);
            return;
        }

        let group = groups[role.id];
        group.addMember(interaction.member.id);
        await interaction.reply({
            content: `Successfully added to ${role.name}!`,
            embeds: [buildEmbed(interaction, group)],
        });

        // check if full, if so ping all and clear group
        if (group.members.length === group.limit) {
            let ping = group.members.map((id) => `<@${id}>`).join(",");
            await interaction.followUp({
                content: `${ping}, ${role.name} is now full! Clearing...`,
            });
            group.clear();
        }
    },
};
