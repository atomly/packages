# `beast-hubful`

> TODO: description

## Usage

```js
const hubful = require('beast-hubful');

// TODO: DEMONSTRATE API
```

## Definitions & Workflow

### Sockets Service

Used to allow real-time connections from front-end clients to the server.

- 1 socket per client.
- Sockets have many events.
- Can initiate/store, update and auto-expire.

### Storage Service

Storage Service to hold data for a short duration in case the subscriber is slow, it will still have a window to consume it. e.g. Redis supports short-lived data. It has the capabilities to initiate, update and auto-expire. It also puts less load on the application.

- Storage services store subscribers, topic names, and messages.

### Publisher Service

- Publisher sends message.
- This starts an event, triggered by the published messages.
- The event reaches the Hub, and stores the message in the Storage Service (e.g. Redis) - with auto-expire.
- After storing the message in Storage Service, check if the client is on a Storage Service connection.
- All subscribed clients in the Storage Service will receive the message.

## Articles

[PubSub service](https://www.smashingmagazine.com/2018/06/pub-sub-service-in-house-node-js-redis/).
