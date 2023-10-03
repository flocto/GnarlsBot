const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Group } = require("../util/group.js");
const { DEBUG } = require("../config.json");

const groups = {};
// role id -> group object cuz i can

function log(s) {
    if (s instanceof Object) s = JSON.stringify(s);
    console.log(`${new Date()} editgroups.js: ${s}`);
}

module.exports = {
    groups: groups,
    data: new SlashCommandBuilder()
        .setName("editgroups")
        .setDescription(
            "Add a group for people to find! Requires admin permissions."
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Add a role for people to look for")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Which role in question?")
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("limit")
                        .setDescription(
                            "What's the max number of people in this group?"
                        )
                        .setMinValue(1)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription(
                    "Remove a role from the list of available groups"
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Which role in question?")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("clear")
                .setDescription("Clear a particular role's group")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Which role in question?")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("setlimit")
                .setDescription("Set a limit for a particular role's group")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Which role in question?")
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("limit")
                        .setDescription(
                            "What's the max number of people in this group?"
                        )
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(0), // admins only
    async execute(interaction) {
        if (DEBUG) {
            log(interaction.user);
            log(interaction.member);
            log(interaction.guild);
            log(interaction.options);
        }

        let roleId = interaction.options.getRole("role").id;
        let limit = interaction.options.getInteger("limit") ?? 5;
        switch (interaction.options.getSubcommand()) {
            case "add":
                if (roleId in groups) {
                    await interaction.reply("This role already exists!");
                    return;
                }
                groups[roleId] = new Group(roleId, limit);
                await interaction.reply(
                    `Successfully added ${
                        interaction.options.getRole("role").name
                    }!`
                );
                break;
            case "remove":
                if (!(roleId in groups)) {
                    await interaction.reply("This role does not exist!");
                    return;
                }
                delete groups[roleId];
                await interaction.reply(
                    `Successfully removed ${
                        interaction.options.getRole("role").name
                    }!`
                );
                break;
            case "clear":
                if (!(roleId in groups)) {
                    await interaction.reply("This role does not exist!");
                    return;
                }
                groups[roleId].clear();
                await interaction.reply(
                    `Successfully cleared ${
                        interaction.options.getRole("role").name
                    }!`
                );
                break;
            case "setlimit":
                if (!(roleId in groups)) {
                    await interaction.reply("This role does not exist!");
                    return;
                }
                groups[roleId].setLimit(limit);
                break;
            default: // this will never happen
                await interaction.reply("Invalid command!");
        }
    },
};
