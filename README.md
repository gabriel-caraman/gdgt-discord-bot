# gdgt-discord-bot
wip

## Commands
fields with the question mark (?) at the end are not required
event management to do: add a confirmation dialog

### Event management
* `/event-create [name] [tag] [default-stage?]` - Create an event with a unique alphanumerical tag. The first stage is set by default to Qualifiers.
* `/event-delete [tag]` - Delete the event with the given tag.
* `/event-set-active [tag]` - Set the event as active/default for the current server. This means that all commands submitted by participants in the server will automatically be attached to this event.
* `/event-team-size [min] [max]` - Change the team size values of the active event. The defaults when creating any event are `min: 2`, `max: 5`.
* `/event-registrations-state [state]` - Change the registrations state of the active event. Participants will be able to register teams only while the registrations are open.
* `/event-submissions-state [state]` - Change the submissions state of the active event. Participants will be able to submit entries only while the submissions are open.