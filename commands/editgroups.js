const { SlashCommandBuilder } = require('discord.js');

const groups = {}; 
// role id -> [user1, user2, user3, ...]
const groupLimits = {};
// default 5, otherwise specified here by admin

const DEBUG = true;
function log(s){
    if (s instanceof Object) s = JSON.stringify(s);
    console.log(`${new Date()} editgroups.js: ${s}`);
}

async function listGroups(interaction) {
    // TODO: make this a paginated embed
    await interaction.reply('hi im still working on list');
    let groupNames = [];
    for (let roleId in groups) {
        groupNames.push(interaction.guild.roles.cache.get(roleId).name);
    }
    await interaction.followUp(groupNames.join('\n')); // pray this works
}

module.exports = {
    groups: groups,
    groupLimits: groupLimits,
	data: new SlashCommandBuilder()
		.setName('editgroups')
		.setDescription('Add a group for people to find! Requires admin permissions.')
        .addStringOption(option => option
            .setName('command')
            .setDescription('What do you want to do? (add, remove, list, clear, setlimit)')
            .setRequired(true)
            .addChoices(
                {
                    name: 'add',
                    value: 'add'
                },
                {
                    name: 'remove',
                    value: 'remove'
                },
                {
                    name: 'list',
                    value: 'list'
                },
                {
                    name: 'clear',
                    value: 'clear'
                },
                {
                    name: 'setlimit',
                    value: 'setlimit'
                }
            )
        )   
        .addRoleOption(option => option
            .setName('role')
            .setDescription('Which role in question?')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(0)
        ,
	async execute(interaction) {
        let roleId = interaction.options.getRole('role').id;
        if (DEBUG) {
            log(interaction.user);
            log(interaction.member);
            log(interaction.guild);
            log(interaction.options);
            log(roleId);
        }

        switch (interaction.options.getString('command')) {
            case 'add':
                if (roleId in groups) {
                    await interaction.reply('This role already exists!');
                    return;
                }
                groups[roleId] = [];
                await interaction.reply(`Successfully added ${interaction.options.getRole('role').name}!`);

                break;
            case 'remove':
                if (!(roleId in groups)) {
                    await interaction.reply('This role does not exist!');
                    return;
                }
                delete groups[roleId];
                await interaction.reply(`Successfully removed ${interaction.options.getRole('role').name}!`);
                break;
            case 'list':
                await listGroups(interaction);
                break;
            case 'clear':
                if (!(roleId in groups)) {
                    await interaction.reply('This role does not exist!');
                    return;
                }
                groups[roleId] = [];
                await interaction.reply(`Successfully cleared ${interaction.options.getRole('role').name}!`);
                break;
            case 'setlimit':
                await interaction.reply('hi im still working on setlimit');
                break;
            default: // this will never happen
                await interaction.reply('Invalid command!');
        }
	},
};