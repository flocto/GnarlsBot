# GnarlsBot
The official unofficial bot for the TNS FPS Discord

## Acknowledgements
Created using [discord.js](https://discordjs.dev/). 

## Documentation
The bot is still in progress, and documentation may change at any time.

### Commands
- `/listgroups`
  - Lists all the available groups in the server in a nice embed.
- `/lookingfor <role>`
  - Adds the user to the specified role's group
  - If the group is full, all users in the group will be notified and the group will be cleared.
- `/editgroups`
  - Admin only command. Several subcommands to edit groups.
  - `/editgroups add <group> limit <limit>`
    - Adds a group to the server, with an optional limit that defaults to 5.
  - `/editgroups remove <group>`
    - Removes a group from the server.
  - `/editgroups clear <group>`
    - Clears all members from a group.
  - `/editgroups setlimit <group> <limit>`
    - Sets the limit of a group, in case you want to change it.