# Chat UI Quickstart

## Prerequisites

- Node.js and npm versions supported by this repository.
- Dependencies installed from the repository root with `npm install`.
- A configured application environment and authenticated session to reach `/chat`; the dedicated chat layout group remains protected by the application's existing route authentication.

## Start the app

From the repository root:

```sh
npm run dev
```

Open the web app and navigate to `/chat` while authenticated.

## Manual UI testing

The user will validate the UI manually in the running app. Use the interactions below as the walkthrough; no automated test commands are part of this feature's validation plan.

1. Start the app using the repository's normal development workflow and open `/chat`.
2. At desktop width, confirm the list is shown initially with no active conversation, then select a conversation and check that its messages appear beside the list.
3. Search by a visible participant or group name. Combine the query with Unread, Favourites, and Groups; verify no-results can be cleared.
4. Send a non-empty message with the send button and Enter. Verify it appears trimmed and updates the conversation preview; confirm empty and whitespace-only messages do not appear.
5. Switch conversations and return, then reload. Verify the sent message remains during the page session and reload restores the sample data.
6. Open New Conversation, choose a sample contact, and verify a thread opens. Choose a contact with an existing direct conversation and verify it is reused; cancel the chooser and verify nothing is created.
7. At narrow mobile width, verify the list appears before selection, the chat replaces it after selection, and Back restores the list. Check composer access and horizontal overflow.
8. Confirm call, voice, and attachment controls do not claim successful actions, and check keyboard focus and accessible control names.

No unit, integration, or automated browser test suite is requested for this feature.

See [data-model.md](./data-model.md) for page-session entities and [contracts/chat-ui.md](./contracts/chat-ui.md) for observable UI behavior.
