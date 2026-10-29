# Feature Specification: Chat UI

**Feature Branch**: `014-chat-ui`  
**Created**: 2026-10-21  
**Status**: Draft  
**Input**: User description: "I want to build chat ui from @stitch-screen/chat-page.html that will handle basic frontend functionaliy all backend logic will be created later"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and select a conversation (Priority: P1)

As a user, I want to browse sample conversations, find conversations by search or category, and open one to read its messages.

**Why this priority**: Selecting and reading a conversation is the core purpose of the chat experience and gives a useful frontend demonstration without backend services.

**Independent Test**: Start the chat with sample conversations, search and filter the list, select a result, and verify the matching conversation appears.

**Acceptance Scenarios**:

1. **Given** the chat page opens with no conversation selected, **When** the conversation list is shown, **Then** it displays the provided sample conversations and no conversation message pane is selected.
2. **Given** sample conversations are available, **When** the user enters a search term or selects All, Unread, Favourites, or Groups, **Then** the visible list matches both the search and selected category.
3. **Given** a conversation is visible in the list, **When** the user selects it, **Then** its identity and sample messages appear in the chat view.
4. **Given** a conversation is open on a narrow screen, **When** the user returns to the conversation list, **Then** the list is shown and the conversation pane is hidden.

---

### User Story 2 - Compose and send a local message (Priority: P1)

As a user, I want to send a text message in the selected conversation and see it immediately in the message history.

**Why this priority**: A locally simulated send is the primary interactive chat function and demonstrates the compose-to-history flow without implying a working messaging service.

**Independent Test**: Open a sample conversation, send a non-empty message using the send control and keyboard, then verify the message and conversation preview update; verify a blank message is not added.

**Acceptance Scenarios**:

1. **Given** a conversation is selected and the composer contains non-whitespace text, **When** the user activates Send or presses Enter, **Then** the trimmed message appears as an outgoing message in that conversation and the composer is cleared.
2. **Given** the composer is empty or contains only whitespace, **When** the user attempts to send, **Then** no message is added.
3. **Given** a message is sent, **When** the user switches to another conversation and returns during the same page session, **Then** the sent message remains visible in the original conversation.
4. **Given** a sent message updates the conversation preview, **When** the user reloads the page, **Then** the page returns to its sample data without the locally sent message.

---

### User Story 3 - Start a conversation from sample contacts (Priority: P2)

As a user, I want to start a conversation with a sample contact so I can explore the new-chat flow without a contact or messaging backend.

**Why this priority**: This completes the basic conversation-list experience while keeping creation explicitly local and limited to supplied sample data.

**Independent Test**: Activate New Conversation, select a listed sample contact, and verify a conversation opens and appears in the list; verify canceling leaves the list unchanged.

**Acceptance Scenarios**:

1. **Given** the user is viewing the conversation list, **When** they activate New Conversation, **Then** they can choose from the available sample contacts.
2. **Given** the new-conversation contact chooser is open, **When** the user selects a contact, **Then** a conversation for that contact is opened and appears in the conversation list for the current page session.
3. **Given** the chooser is open, **When** the user cancels it, **Then** no conversation is created.

### Edge Cases

- A search with no matching conversations shows an empty state and allows the search to be cleared.
- A selected category with no matching conversations shows an empty state without removing or altering the underlying conversation list.
- Whitespace-only message text is not sent; leading and trailing whitespace on a non-empty message is removed.
- Starting a conversation with a contact that already has a conversation opens the existing conversation rather than duplicating it.
- On a narrow screen, selecting a conversation replaces the list with the message view; returning restores the list, and composer actions remain reachable above the device safe area.
- Conversation and message changes are local to the active page session and do not communicate with a backend or survive a reload.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The chat page MUST match the supplied desktop chat design and the supplied mobile conversation-list and active-conversation designs.
- **FR-002**: The `/chat` route MUST show the conversation list on the left and leave the right pane empty; `/chat/[id]` MUST show the conversation list on the left with the selected conversation on the right.
- **FR-002a**: The left rail, mobile bottom tab bar, and conversation list MUST render from the shared `(chat)` layout; individual pages MUST render only the right pane content.
- **FR-002b**: On narrow screens, `/chat` shows the conversation list full-screen; `/chat/[id]` shows only the selected conversation with a back control, per the supplied mobile designs.
- **FR-003**: The user MUST be able to select a conversation and view its participant details and sample messages.
- **FR-004**: The user MUST be able to search conversations by visible participant or conversation name and combine the search with the All, Unread, Favourites, and Groups categories.
- **FR-005**: The user MUST be able to compose and locally send non-empty text messages in the selected conversation using the send control or Enter key.
- **FR-006**: The page MUST add locally sent messages to the active conversation, update that conversation's preview, and retain them while the page remains open, without persisting them beyond that page session.
- **FR-007**: The user MUST be able to start a conversation with a sample contact; choosing an existing participant MUST reopen the existing conversation rather than create a duplicate.
- **FR-008**: On narrow screens, selecting a conversation MUST display the conversation and hide the list; a back control MUST return to the list. On wider screens, the list and selected conversation MUST appear together.
- **FR-009**: The page MUST expose accessible names for interactive controls and provide visible empty states when search or category filters produce no conversations.
- **FR-010**: Calls, voice recording, file attachments, delivery/read status, presence, and other backend-dependent actions MUST NOT be represented as successfully performed; these controls are outside this frontend-only scope.

### UI Components

Components live in `apps/web/src/features/chat/components/` (PascalCase filenames) and mirror the three `stitch-screen/` HTML references. Responsibilities and responsive behavior per component are in `chat-components.md` (repo root).

| Component | Source mock | Role in routes |
|---|---|---|
| `LeftIconRail` | `chat-page.html` | `(chat)/layout.tsx`, desktop left rail |
| `BottomTabBar` | `chat-page-mobile-chatlist.html` | `(chat)/layout.tsx`, mobile bottom tabs |
| `ChatsListHeader` | `chat-page.html`, `chat-page-mobile-chatlist.html` | conversation list header (layout) |
| `SearchInput` | same | list search (layout) |
| `FilterPills` | same | list category filters (layout) |
| `RecentChatsStrip` | same | recent chats strip (layout) |
| `ConversationListItem` | same | one row in All Chats list (layout) |
| `ConversationsSidebar` | `chat-page.html` | desktop list pane composition (layout) |
| `MobileChatListScreen` | `chat-page-mobile-chatlist.html` | narrow-screen list view (layout) |
| `ChatHeader` | `chat-page.html`, `chat-page-mobile.html` | selected conversation header (`[id]` page) |
| `MessageStream` | same | message timeline (`[id]` page) |
| `MessageBubble` | same | one message row (`[id]` page) |
| `DateSeparator` | same | date divider (`[id]` page) |
| `CallLogCard` | same | call event card (`[id]` page) |
| `MessageComposer` | same | message input dock (`[id]` page) |
| `ChatScreen` | `chat-page.html`, `chat-page-mobile.html` | conversation pane composition (`[id]` page) |

Layout (`apps/web/src/app/(chat)/layout.tsx`): `LeftIconRail` + `ConversationsSidebar` at desktop widths; `MobileChatListScreen` + `BottomTabBar` at narrow widths. Pages: `(chat)/page.tsx` renders an empty right pane; `(chat)/[id]/page.tsx` renders `ChatScreen` for the selected conversation with sample data from `apps/web/src/features/chat/data/sample-conversations.ts` (bundled mock data).


### Key Entities

- **Conversation**: A sample or page-session conversation identified by its participant or group, with a category, preview, and associated messages.
- **Message**: A sample or page-session text item associated with a conversation, containing display content, author, and time.
- **Sample contact**: A supplied demonstration participant available for starting a local conversation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a usability walkthrough, users can open any visible sample conversation from the list within 10 seconds without assistance.
- **SC-002**: In a usability walkthrough, users can filter or search the sample conversation list and identify a matching conversation within 15 seconds.
- **SC-003**: In a usability walkthrough, users can send a message and see it in the selected conversation within 10 seconds; blank messages never appear in conversation history.
- **SC-004**: At desktop widths, the conversation list and selected chat are visible together; at narrow mobile widths, the list and selected chat display as separate navigable views without horizontal page overflow.
- **SC-005**: All local conversation and message changes are lost on reload, and no chat action requires or claims a backend response.

## Assumptions

- The three supplied Stitch HTML screens are the visual references; the desktop screen defines the wider layout and the two mobile screens define the list and conversation views on narrow displays.
- The user has requested basic frontend interactions only. Sample data, message sending, search/filter, and conversation creation are local UI behavior; backend persistence, real delivery, calls, attachments, and presence are out of scope.
- The chat page starts with no selected conversation. Selecting a conversation opens it; narrow layouts show only the active list or chat view, with a back action from chat.
- Sample contact identities and sample conversations are provided by the UI and need no external account or contact service.
- Existing application navigation and authentication remain unchanged; chat-specific backend services are not a prerequisite for the frontend experience.
