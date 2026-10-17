Goal: Add chat server feature to app

Tech:

- Mongodb for storing chat messages
- socket.io
- some message queue

Process:

- Users connects to the chat server via socket.io
- user send a message,
  - store in mongodb collection
  - put the message in a message queue
  - if other user is online
    - send the message from queue
  - if other user is offline
    - queue the message in a seperate waiting queue
    - send the message when the user comes online

User preseence:
Server sends 1m ping to the client to check if the user is still online. If the user responds, mark the user as offline.
if user logs out, mark the user offline
user presence stored in redis

# Plan

Create new folder `chat-server` in the root of the project. This will be a separate nodejs server that will handle all chat related Backend features.

## New Tables

1. Converstaions
   - id
   - user1_id
   - user2_id

[Each Converstaions id is a collection in mongodb/mongoose where messages are stored]

### Eaah Message document

    - id
    - conversation_id
    - sender_id
    - receiver_id
    - content
    - timestamp
    - media[]
    - isSeen
