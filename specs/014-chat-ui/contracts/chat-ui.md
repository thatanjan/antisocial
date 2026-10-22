# Chat UI Contract

## Scope

The authenticated chat page is a user-facing frontend surface backed only by bundled sample data and in-memory page state. This contract defines observable UI behavior. It introduces no API, server action, database, or durable data contract.

## Route and rendering

- The chat surface is hosted at `/chat` in the dedicated `(chat)` App Router layout group, outside `(authenticated)`.
- The route page and static shell render as server components. Only the interactive workspace requiring browser events and ephemeral state is client-rendered.
- At wider widths, the conversation list and selected conversation appear side by side.
- On narrow screens, the list is shown when no conversation is selected; choosing a conversation shows the active chat; Back returns to the list.
- The active page begins with no selected conversation.

## Conversation list behavior

- The initial list contains bundled sample conversations.
- Search matches displayed participant or conversation names without case sensitivity and can be combined with one category filter.
- All, Unread, Favourites, and Groups select the corresponding list view. No matches produce a visible empty state; clearing search or selecting All allows recovery.
- Selecting a conversation shows its own title, sample message history, and composer.
- New Conversation opens a chooser populated only by bundled sample contacts. Choosing an existing direct participant opens their current conversation; otherwise, a new empty local conversation is created for the current page session. Cancel closes the chooser without state changes.

## Message composer behavior

- The user can submit by activating Send or pressing Enter.
- Submission trims text. Empty or whitespace-only text creates no message and does not clear or alter existing history.
- A successful local submission adds one outgoing message, clears the composer, updates the conversation preview, and keeps the message visible when switching conversations.
- This behavior is a local UI simulation; it MUST NOT announce delivery, read, or remote receipt.
- Page reload resets all changed data to the bundled sample data.

## Accessibility and design constraints

- Interactive controls expose accessible names, support keyboard operation, and have visible focus treatment.
- Use existing shadcn UI primitives, Lucide React icons, Tailwind utility classes, and semantic theme tokens from `apps/web/src/app/globals.css`; standard Tailwind palette classes are allowed where those tokens do not define a color.
- Do not use arbitrary Tailwind values or add colors to the theme for this feature.
- Desktop and mobile visual references are `stitch-screen/chat-page.html`, `stitch-screen/chat-page-mobile-chatlist.html`, and `stitch-screen/chat-page-mobile.html`.
- Calls, voice recording, attachments, and real-time presence are not implemented. Any displayed samples for these are inert and cannot claim a successful live operation.
