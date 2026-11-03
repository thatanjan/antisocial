# Chat UI Data Model

All data in this feature is bundled demonstration data from `apps/web/src/features/chat/data/sample-conversations.ts` plus page-session state. No database records or server-side mutations are created. Shared TypeScript types live in `apps/web/src/features/chat/types.ts`.

## Conversation

Represents one one-to-one or group thread shown in the conversation list.

| Field | Meaning | Validation / behavior |
|---|---|---|
| `id` | Stable client-side identifier for the page session | Unique among conversations during this page session. |
| `title` | Participant name or group name displayed in the list and header | Non-empty display label. |
| `kind` | Conversation category | `direct` or `group`; used by the Groups category. |
| `participantIds` | Sample contacts represented by this thread | Non-empty; unique within the conversation. |
| `avatar` | Optional avatar reference for the list and header | May be absent; display initials fallback. |
| `online` | Sample presence indicator when included in design | Presentation-only sample value; not a live presence claim. |
| `unread` | Whether sample data marks the conversation unread | Boolean demo state used by Unread filter. |
| `favourite` | Whether the conversation is marked favourite | Boolean demo state used by Favourites filter. |
| `messages` | Ordered sample and page-session messages | Each message belongs to this conversation; append newly sent message at the end. |
| `preview` | Latest visible message summary shown in conversation list | Derived from latest message when present; local send updates it immediately. |

## Message

A text or sample presentation item associated with a conversation.

| Field | Meaning | Validation / behavior |
|---|---|---|
| `id` | Stable client-side identifier | Unique within the page session. |
| `conversationId` | Conversation that owns the item | Must identify an existing in-memory conversation. |
| `author` | Display name of sender | Non-empty; local sends use the current sample user label. |
| `body` | Message text or fixed sample display text | Locally sent text is trimmed and MUST NOT be empty after trimming. |
| `createdAt` | Display timestamp | Generated locally for sent items; sample values may use provided display times. |
| `direction` | Whether the item is incoming or outgoing | `incoming` or `outgoing`; sent items are outgoing. |
| `kind` | Presentation shape | `text` or a static `sample-event` item such as a demonstration call summary. Sample events are non-interactive and never represent a real action. |

## Sample Contact

A participant available in the local new-conversation picker.

| Field | Meaning | Validation / behavior |
|---|---|---|
| `id` | Stable identifier for sample data | Unique in sample contact data. |
| `name` | Contact label | Non-empty; used by picker and search. |
| `avatar` | Optional sample avatar reference | May be absent; use initials fallback. |
| `online` | Optional sample presence indicator | Display-only sample state, not a live service. |

## Relationships and state transitions

- One conversation has one or more sample contacts and zero or more messages.
- Each message belongs to exactly one conversation.
- A contact can appear in multiple groups, but a newly requested one-to-one conversation must reuse the existing direct conversation for that contact when present.
- Selecting a conversation navigates to `/chat/[id]`; the conversation id is carried by the URL param. On narrow screens the conversation view replaces the list; Back returns to `/chat`.
- Sending trimmed non-empty text appends an outgoing message, updates the preview, and keeps both in memory until the page is reloaded or closed.
- Search and category filter are view state only; they never mutate the underlying conversations.
- Reload discards page-session changes and reseeds the static sample data.
