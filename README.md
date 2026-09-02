# gdgt-discord-bot
wip

Using Node.js v24.18.0

## Setup (temporary, will add Docker components and change this)
1. Run `npm install` to get all needed packages
2. Create or add the .env file in the source directory
3. Make sure mongod.exe is running
4. Run `npm run start`

## Commands
fields with the question mark (?) at the end are not required

event management to do: add a confirmation dialog

### Event management // TO DO: go over all scripts and standartize all checks
* `/event-create [name] [tag] [default-stage?]` - Create an event with a unique alphanumerical tag. The first stage is set by default to Qualifiers.
* `/event-delete [tag]` - Delete the event with the given tag.


* `/event-set-active [tag]` - Set the event as active/default for the current server. This means that all commands submitted by participants in the server will automatically be attached to this event.


* `/event-team-size [min] [max]` - Change the team size values of the active event. The defaults when creating any event are `min: 2`, `max: 5`.


* `/event-registrations-state [state]` - Change the registrations state of the active event. Participants will be able to register teams only while the registrations are open. False by default.
* `/event-submissions-state [state]` - Change the submissions state of the active event. Participants will be able to submit entries only while the submissions are open. False by default.


* `/event-stage [name] [order]` - Modify a given stage of the active event. This command has different actions:
    - If the provided name is unique, create a new stage
    - If the provided order is 0, delete the stage with the provided name
    - All other cases will update the stage with the provided name


* `/event-archive [tag] [state]` - Archive/unarchive an event. Archived events will be locked from any changes both by admins and participants.