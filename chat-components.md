# Chat Components — Responsive React Breakdown

Analysis of the three HTML screens in `stitch-screen/`:

- `chat-page.html` — desktop three-pane layout (727 lines)
- `chat-page-mobile.html` — mobile active-chat (conversation) screen (217 lines)
- `chat-page-mobile-chatlist.html` — mobile chat list (conversation index) screen (357 lines)

Each numbered entry is one reusable responsive React component: the line ranges that implement it in each file (omitted = component is not present in that file), its responsibilities, and its responsive behavior. A single component owns one visual entity across viewports.

## Line-Range Index

1. [LeftIconRail](#1-lefticonrail)
2. [BottomTabBar](#2-bottomtabbar)
3. [ChatsListHeader](#3-chatslistheader)
4. [SearchInput](#4-searchinput)
5. [FilterPills](#5-filterpills)
6. [RecentChatsStrip](#6-recentchatsstrip)
7. [ConversationListItem](#7-conversationlistitem)
8. [ConversationsSidebar](#8-conversationssidebar)
9. [MobileChatListScreen](#9-mobilechatlistscreen)
10. [ChatHeader](#10-chatheader)
11. [MessageComposer](#11-messagecomposer)
12. [MessageStream](#12-messagestream)
13. [MessageBubble](#13-messagebubble)
14. [DateSeparator](#14-dateseparator)
15. [CallLogCard](#15-calllogcard)
16. [ChatScreen](#16-chatscreen)

---

## 1. LeftIconRail

- chat-page.html:93-209

Desktop-only vertical navigation rail. Fixed `w-16` (grows to `md:w-[72px]`), border-right, full height, top/bottom sections split via `justify-between`.

**Responsibilities**
- App brand logo link (terracotta tile, hover → filled terracotta, lines 101-111)
- Primary nav items: Chats (active, terracotta fill), Contacts, Groups, Stories, Calls, Profile, Settings — one icon button pattern repeated (lines 113-189)
- Bottom controls: dark-mode toggle button (193-201) and current-user avatar (203-206)
- `data-purpose="navigation-rail"` (line 97) — keep this data attribute in React for E2E/tests
- In React, render the 7 nav items from an array (icon, label, href, active) — the HTML repeats the same 44px button markup seven times

**Responsive behavior**
- `w-16` → `md:w-[72px]`
- **Mobile:** absent. Navigation moves to `BottomTabBar` (#2). `LeftIconRail` renders nothing below the breakpoint where the desktop layout is shown — reuse the HTML's exact breakpoints (`sm`, `md`) via Tailwind responsive classes or conditional rendering in `ChatScreen`.

**Notes**
- The active-item treatment differs per section: nav uses `bg-terracotta text-white shadow-sm` (lines 115-117); the same rail icons reuse across the app (search, video, voice, info, more in `ChatHeader` #10). In React, prefer a shared `IconButton`/icon map so SVGs live in one place instead of copy-pasted markup.
- Anchors are `href="#"` placeholders with `aria-label`/`title` (per the file's biome-ignore comments) — convert to real links or `router` navigation in React.
- Contains the theme-toggle button — a client-side concern; the rail can stay a server component with a small client wrapper for the toggle.

---

## 2. BottomTabBar

- chat-page-mobile-chatlist.html:307-347

Mobile-only bottom tab navigation (iOS style). Absolutely positioned at the bottom of the device container, translucent blurred surface, 4 tabs + profile avatar tab.

**Responsibilities**
- Tab items: Chats (active → `text-terracotta`, bold label), Calls, Contacts, Settings — same vertical icon+label pattern (lines 310-340)
- Profile avatar tab "Me" (lines 342-345)
- Tab switching/navigation state

**Responsive behavior**
- **Desktop:** absent. `LeftIconRail` (#1) is the desktop equivalent — both encode the same nav set (Chats/Calls/Contacts/Settings). In React, drive both from a single shared `NAV_ITEMS` array and render `LeftIconRail` on `md+`, `BottomTabBar` below, or fold tab bar into `MobileChatListScreen`.

**Notes**
- Fixed-height dock; pair with `pb-20` on the scrollable content above (line 93) so the last list item clears the bar.
- `absolute bottom-0` only works inside the `MobileDeviceContainer` frame; in a real app this becomes `fixed`/`sticky` at the viewport bottom with safe-area padding (`env(safe-area-inset-bottom)`), the pattern `chat-page-mobile.html` uses for its composer (line 172).
- Icon set here is inline SVG (Tailwind stroke style); the mobile chat screen uses Material Symbols font icons. Pick one icon system for the React app and normalize during conversion (repo convention: design tokens, no arbitrary values).

---

## 3. ChatsListHeader

- chat-page.html:214-239
- chat-page-mobile-chatlist.html:70-91

"Chats" screen header with title and quick actions.

**Responsibilities**
- Title: "Antisocial" (desktop, line 217) vs "Chats" (mobile, line 72)
- New-chat terracotta "+" button (desktop lines 219-227; mobile lines 75-80)
- More-options kebab button (desktop lines 228-237; mobile lines 81-88)

**Responsive behavior**
- Desktop renders inside the sidebar (`<aside>`, padded, borderless); mobile renders as a top-level `<header>` with larger `text-3xl` title. Same 3-part structure (title, new, kebab) — one component, breakpoint-driven title/touch sizes.
- On mobile, clicking a chat navigates to the chat screen (`ChatHeader` #10 shows the back button), so this header effectively disappears in the active-chat state.

**Notes**
- The mobile file's `iOSStatusBar` (lines 67-69) and `iOSHomeIndicator` (lines 348-352) are empty/markup placeholders for the device frame mock — implementation details of the Stitch mock, not app UI. In React, treat the container (line 66) as a mock-only wrapper and do **not** port the device chrome; only `pt-safe`/`pb-safe` handling from `chat-page-mobile.html` is real.
- Group with `SearchInput` (#4) and `FilterPills` (#5) into the mobile list header stack.

---

## 4. SearchInput

- chat-page.html:240-252
- chat-page-mobile-chatlist.html:94-104

Search / "start a new chat" input with trailing search icon overlay.

**Responsibilities**
- Text query input, placeholder text
- Trailing magnifier icon positioned inside the field (absolute right)

**Responsive behavior**
- Desktop: `h-10` in the sidebar, `bg-tint-fill rounded-xl`, terracotta focus ring (lines 242-244). Mobile: `bg-[#eeeff1] rounded-xl py-2`, terracotta focus ring, clears to white on focus (lines 97-98).
- Both carry `data-purpose="search-bar"` (mobile) — preserve.
- Identical placeholder string "Search or start a new chat" in both — shared copy, one component.

**Notes**
- Controlled React input; wire to conversation list filtering. The icon overlay pattern (`relative` wrapper + absolutely positioned `span`) is the same in both files.

---

## 5. FilterPills

- chat-page.html:253-268
- chat-page-mobile-chatlist.html:105-131

Category filter pills: All / Unread / Favourites / Groups + trailing filter-list icon button.

**Responsibilities**
- Single-select filter state (All active in both mocks)
- Pill rendering with active vs inactive styles
- Overflow filter action

**Responsive behavior**
- Both: horizontal `overflow-x-auto no-scrollbar` strip of `rounded-full text-xs` pills; desktop sits inside the sidebar header, mobile is its own section with `justify-between` and the filter icon pushed right.
- In React, a `selected` prop (or URL search param) replaces the hard-coded active class; same pill set renders at any width.

**Notes**
- Desktop pills use `font-semibold` active vs `font-medium` inactive and slightly different padding (`px-3.5` vs `px-3`); mobile uses uniform `px-3.5`. Normalize in the shared component.

---

## 6. RecentChatsStrip

- chat-page.html:272-328
- chat-page-mobile-chatlist.html:132-188

"Recent Chats" horizontal avatar strip (story-style) with section label and options button.

**Responsibilities**
- Section header: uppercase label + kebab options (desktop lines 274-283; mobile lines 134-143)
- Horizontally scrollable avatar items: Mark, Emily, Clyde, Design — each a `relative` avatar with presence dot and name below (desktop lines 284-327; mobile lines 145-186)
- Emily carries the terracotta "active/selected" ring in both files (desktop line 299: `ring-terracotta`; mobile lines 159: `border-2 border-terracotta`)
- Presence dots: emerald online (Mark/Emily/Design), terracotta for Clyde

**Responsive behavior**
- Same horizontal-scroll behavior at all sizes; mobile adds an `h-px` divider after the section (mobile line 190).
- Avatar ring technique differs: desktop uses `ring-2 ring-offset-1` on the `img`; mobile wraps the `img` in a padded bordered circle (`p-[1.5px] border` / `p-[2px] border-2` for the active terracotta ring). In React, one `Avatar` primitive with `ring`/border props covers both.
- **Desktop chat screen:** absent — the strip lives only in the sidebar pane. If a tablet layout shows list + chat, keep the strip in the list pane only.

**Notes**
- In React, render items from a `recentChats` array (avatar, name, presence, active). The repeated markup (4× identical blocks per file) is the clearest extraction candidate.

---

## 7. ConversationListItem

- chat-page.html:329-462 (list wrapper 330-334; items at 335-363, 364-389, 390-415, 416-442, 443-460)
- chat-page-mobile-chatlist.html:191-304 (list wrapper 194; items at 195-218, 219-240, 241-261, 262-285, 286-301)

A single row in the "All Chats" list. The most repeated UI in both files (5 instances each, same 5 conversations, same timestamps).

**Responsibilities**
- Avatar with optional presence dot; group conversations render initials tile instead of `img` ("AM Technology", desktop lines 366-373, mobile lines 222-227)
- Name + timestamp row (name truncates; timestamp in mono meta style)
- Last-activity preview line, one of four variants:
  - plain text snippet ("Thanks, I will review the numbe...")
  - icon + label ("Video Call", "Voice Call", "Voice Call Cancelled" — cancelled in terracotta)
  - read-receipt double-check marks (after last outgoing message)
  - pinned indicator (desktop pin icon at 355-360; mobile rotated pin at 213-216)
- Active/selected state: terracotta tint background + border, bold name, terracotta timestamp (desktop lines 390-392/401-402; mobile lines 242/249/259)
- `onClick` → select conversation (desktop) or navigate to chat screen (mobile)

**Responsive behavior**
- One component, breakpoint-driven density: desktop `gap-3 p-2.5 rounded-xl` inside `w-80`/`md:w-96` sidebar; mobile `px-2 py-2.5 rounded-2xl` full-width. Structure (avatar | two-line text block | right meta column) is identical — only spacing, radii, and font scale differ.
- The active conversation (Emily Carter) maps to the conversation shown in `ChatScreen` (#16); selection state should live in app state (or URL) shared by both layouts.

**Notes**
- Preview icon variants are minimal SVGs reused elsewhere (video/call/cancelled also appear in `CallLogCard` #15 and sidebar). Extract a tiny icon map or use the app's icon component.
- Mobile version is the more accessible markup: real `<button>`/clickable div with `aria-label`s on icon buttons, `text-[14px]` preview text vs desktop `text-xs`. When merging into one React component, normalize to design tokens per repo styling rules.

---

## 8. ConversationsSidebar

- chat-page.html:210-465

Desktop-only composite: the middle pane assembling the list-screen pieces in a vertical flex column.

**Responsibilities**
- Pane container: `w-80 md:w-96`, `bg-surface`, border-right, full height, `shrink-0` (line 212); `data-purpose="chat-sidebar"`
- Slots, in order: `ChatsListHeader` (#3, lines 214-269 incl. search + pills), scrollable region (line 271: `overflow-y-auto flex-1`) containing `RecentChatsStrip` (#6) and the All Chats list of `ConversationListItem` (#7)

**Responsive behavior**
- Width `w-80` → `md:w-96`; height constrained to viewport (`h-full` under `body.h-full.overflow-hidden`).
- **Mobile:** the whole pane is replaced by `MobileChatListScreen` (#9) — same content (header, search, pills, recent strip, list) stacked full-width with the `BottomTabBar`. In React, `ChatScreen`/the chats page renders `ConversationsSidebar` at `md+` and `MobileChatListScreen` below, or a single responsive layout that hides the sidebar once a conversation is active on small screens.

**Notes**
- Owns no visual detail of its own beyond the container — a thin layout component composing #3, #4, #5, #6, #7. Keep it that thin in React.
- The scroll container (line 271) is the natural virtualization boundary if the conversation list grows.

---

## 9. MobileChatListScreen

- chat-page-mobile-chatlist.html:63-357

Mobile-only composite: the full chat-list screen inside the device frame.

**Responsibilities**
- Device-frame wrapper (line 66: `max-w-[390px] h-[844px]` mock container — implementation detail, see Notes)
- Composition in order: `ChatsListHeader` (#3, lines 70-91), scrollable `main` (lines 92-305: `SearchInput` #4, `FilterPills` #5, `RecentChatsStrip` #6, `ConversationListItem` list #7), `BottomTabBar` (#2, absolute at bottom), home-indicator (mock chrome)

**Responsive behavior**
- **Desktop:** replaced by `ConversationsSidebar` (#8). The React route for the chats list should render this below the desktop breakpoint and hide it when a conversation is open (mobile navigates to `ChatScreen` #16).
- Scroll: `main` is `flex-1 overflow-y-auto no-scrollbar pb-20` — the `pb-20` reserves space for the tab bar.

**Notes**
- Treat as a thin composition/layout component; all interactive pieces are delegated to #2-#7.
- The 390×844 frame, `iOSStatusBar`, and `iOSHomeIndicator` are Stitch presentation mocks. In React, drop the frame chrome and render the screen full-bleed with safe-area padding (the real pattern from `chat-page-mobile.html` lines 2/4/172).

---

## 10. ChatHeader

- chat-page.html:470-529 (desktop chat pane header)
- chat-page-mobile.html:3-37 (sticky subheader, mobile chat screen)

Active-conversation header showing the recipient and conversation actions.

**Responsibilities**
- Back button (mobile only, lines 6-8, `history.back()`)
- Recipient identity: avatar with presence dot (desktop lines 473-477; mobile lines 9-14), name (truncating), "Online" status (mobile adds a pulsing dot, lines 17-19)
- Action buttons: search, video call, voice call, info, more (desktop lines 484-528); search, video, call, more (mobile lines 23-36 — info omitted)

**Responsive behavior**
- Desktop: static `h-16` header bar at the top of the chat pane. Mobile: `sticky top-0 z-40` with `bg-surface/95 backdrop-blur-md`, `pt-safe` notch padding, and a back affordance that returns to the chat list.
- Same 5 conceptual actions; mobile drops the contact-info button. In React, render actions from a list and hide `info` on small screens (or keep all — normalize).
- `data-purpose="chat-header"` (desktop line 471) — preserve.

**Notes**
- Both variants need `data-purpose="chat-header"` (desktop has it) and the mobile back button becomes client-side router navigation (`history.back()` → `router.back()`).
- Identity block is the same `Avatar` primitive used in #6/#7 — reuse one component with size props (w-10 here, w-12 in strips, w-11 in list rows).

---

## 11. MessageComposer

- chat-page.html:676-719 (footer dock, desktop)
- chat-page-mobile.html:171-194 (fixed bottom dock, mobile)

Message input dock at the bottom of the active conversation.

**Responsibilities**
- Mic/voice-memo button (desktop lines 680-688; mobile lines 174-177)
- Text input ("Type Your Message" placeholder in both)
- Emoji button (desktop lines 692-700; mobile lines 182-184)
- Attach/paperclip button (desktop lines 701-708; mobile lines 185-187)
- Terracotta send button (desktop lines 709-717; mobile lines 188-191)

**Responsive behavior**
- Desktop: static `<footer>` in normal flow at the end of the chat pane. Mobile: `fixed bottom-0 inset-x-0 z-50` with blur, `pb-safe` safe-area padding, and an upward shadow.
- Identical 5-part structure and ordering in both files — one component, container positioning swapped by breakpoint.

**Notes**
- `chat-page-mobile.html` ships a working vanilla-JS send handler (lines 196-217): click or Enter sends, clears, and refocuses `#chat-input`. Port this to React state (controlled input + `onSubmit`); do not carry over the imperative script or `id`-based DOM lookup.
- All icon buttons lack `type="button"` (the biome-ignore at the top of `chat-page.html` acknowledges this) — in React use proper `<button type="button">` and the repo's UI primitives.
- Natural home for a `useSendMessage` hook; keep the component presentational.

---

## 12. MessageStream

- chat-page.html:530-675 (scrollable stream, desktop)
- chat-page-mobile.html:38-170 (stream container, mobile)

Scrollable message canvas for the active conversation.

**Responsibilities**
- Scroll container for the message timeline (desktop line 531: `overflow-y-auto p-6 space-y-6`; mobile line 39: `px-gutter pt-space-lg pb-36 flex flex-col gap-space-lg` — bottom padding clears the fixed composer)
- Dotted background motif: desktop via `.chat-canvas-bg` class (defined lines 81-88: `radial-gradient(#dfe2e5 .75px) 16px grid`); mobile via inline `bg-[radial-gradient(#dfe2e5_1px,transparent_1px)] [background-size:16px_16px]` (line 39)
- Renders the ordered timeline: `DateSeparator` (#14), `MessageBubble` (#13) incoming/outgoing/deleted/starred, `CallLogCard` (#15)
- `data-purpose="messages-stream"` (desktop line 531) — preserve

**Responsive behavior**
- Same 7-message content in both files (identical timestamps: 02:38 AM, 03:38 AM, 04:38 AM, 05:39 AM, 08:25 PM, 09:25 PM, 09:28 PM call card) — render one timeline, restyle per breakpoint.
- Desktop caps bubbles at `max-w-2xl`/`max-w-md`; mobile at `max-w-[85%]`/`max-w-[80%]` (deleted) / `max-w-sm` (call card).
- Mobile version carries extra detail: read receipts under outgoing bubbles ("Read" + `done_all` icon, mobile lines 74-77) and starred-message star inside the bubble (lines 107-110). Fold these into the shared `MessageBubble`/message model rather than branching per viewport.
- Mobile hides scrollbars globally (`::-webkit-scrollbar{display:none}`, line 2); desktop shows a 5px custom scrollbar (lines 62-79). Keep both behaviors behind the breakpoint.

**Notes**
- In React, this is a server-renderable list over the conversation's messages; auto-scroll-to-latest is a client concern (small hook). The dotted-canvas background should become one utility class/`@theme` token instead of two divergent implementations (repo rule: no arbitrary values).

---

## 13. MessageBubble

- chat-page.html:538-552, 553-566 (incoming/outgoing text)
- chat-page.html:567-586 (deleted)
- chat-page.html:587-606 (starred)
- chat-page.html:607-621 (short outgoing)
- chat-page.html:622-636 (follow-up incoming)
- chat-page-mobile.html:46-60, 61-79 (incoming/outgoing)
- chat-page-mobile.html:80-95 (deleted)
- chat-page-mobile.html:96-112 (starred)
- chat-page-mobile.html:113-127 (short outgoing)
- chat-page-mobile.html:128-142 (follow-up incoming)

A single message row. Six instances per file (five distinct variants), same message content across breakpoints.

**Responsibilities**
- Row direction: incoming = avatar left, bubble left (`self-start`); outgoing = avatar right, bubble right (`self-end flex-row-reverse` on mobile / `justify-end` on desktop)
- Sender meta line: name + timestamp (incoming) or timestamp + "You" (outgoing); optional star flag (desktop lines 595-599; mobile line 105)
- Bubble styling by variant:
  - incoming: white surface, border, `rounded-2xl rounded-tl-sm` tail
  - outgoing: terracotta fill, white text, `rounded-tr-sm` tail
  - deleted: dark/ink capsule with block icon, italic "This message was deleted" (desktop lines 574-582; mobile lines 90-93)
  - starred: star in meta and/or inside bubble (desktop lines 595-599; mobile lines 105/109)
- Avatar (w-8 desktop, w-7 mobile, `mt-4`/`mt-1` to align with meta line)
- Mobile-only: read receipt row under outgoing bubbles ("Read" + `done_all`, mobile lines 74-77)

**Responsive behavior**
- One component, breakpoint classes for: bubble max-width (see #12), avatar size (w-8 vs w-7), tail offsets, spacing.
- Mobile achieves direction with `flex-row-reverse` on the row; desktop reorders children and uses `justify-end ml-auto`. In React pick one technique (`flex-row-reverse` for both) to avoid divergent markup.

**Notes**
- Message model implied by the variants: `{ id, direction: 'in' | 'out', sender, timestamp, body?, deleted?, starred?, read? }` — the deleted/starred/read flags drive all conditional rendering. That model covers all 12 markup blocks (6 per file).
- Deleted-message body copy is identical in both files. Starred variant differs slightly (desktop puts star only in meta; mobile repeats it in-bubble) — normalize to the mobile version and note the delta, or keep per-breakpoint detail if pixel-faithful.

---

## 14. DateSeparator

- chat-page.html:532-537
- chat-page-mobile.html:40-45

Centered pill dividing the timeline by date ("Yesterday").

**Responsibilities**
- Date label in an ink-colored pill, centered (`flex justify-center` / `items-center justify-center`)

**Responsive behavior**
- Identical concept in both; mobile adds `my-space-xs` vertical margins and mono/uppercase styling. Pure presentational component, no breakpoint logic needed beyond size tokens.

**Notes**
- Smallest component in the set; co-locate with `MessageStream` (#12) rather than a separate file if the team prefers fewer files.

---

## 15. CallLogCard

- chat-page.html:637-674
- chat-page-mobile.html:143-169

Call-event card rendered inline in the message timeline (as an incoming "message").

**Responsibilities**
- Shared wrapper with `MessageBubble`: sender avatar + meta (name, timestamp) — lines 638-645 desktop, 144-152 mobile
- Card body: call icon in tinted circle, "Voice Call" title, "Emily Carter called" subtitle, "Duration: 1 sec" mono meta
- Call-back action button (desktop lines 662-671; mobile lines 164-166)

**Responsive behavior**
- Same card structure; desktop uses a bordered `rounded-xl` card with blue accent circle and `w-8 h-8` call-back button; mobile uses `rounded-2xl rounded-tl-sm` (bubble tail) with tertiary-fixed accent and a filled circular call-back button.
- Max width `max-w-md` (desktop) vs `max-w-sm` (mobile); mobile card is full-width within it (`w-full`).

**Notes**
- Notably NOT terracotta — this is the one deliberately non-brand-colored element (blue/tertiary accent). Preserve the distinction.
- The call icon SVG (desktop lines 650-654, 666-670) is the same one used in the sidebar, rail, and chat header — reuse the shared icon component.
- Model as a message variant (`type: 'call'`) inside the same timeline data, rendered by this component.

---

## 16. ChatScreen

- chat-page.html:92-727 (body-level three-pane layout: `LeftIconRail` + `ConversationsSidebar` + `MainChatView`)
- chat-page-mobile.html:2-195 (mobile stack: `ChatHeader` + `MessageStream` + `MessageComposer`, plus send-handler script at 196-217)
- chat-page-mobile-chatlist.html:63-357 (see #9; when no conversation is selected on mobile, `ChatScreen` shows the list state instead)

Top-level layout/orchestration component for the chat feature.

**Responsibilities**
- Desktop (`chat-page.html`): `body.h-full flex overflow-hidden` → `LeftIconRail` (#1) + `ConversationsSidebar` (#8) + `MainChatView` (`main.flex-1 flex flex-col`, line 468, composing `ChatHeader` #10, `MessageStream` #12, `MessageComposer` #11) — list and conversation visible simultaneously
- Mobile: two states —
  - list state: renders `MobileChatListScreen` (#9) (`chat-page-mobile-chatlist.html`)
  - conversation state: renders `ChatHeader` (with back button) + `MessageStream` + fixed `MessageComposer` (`chat-page-mobile.html`)
- Owns: selected-conversation state, viewport-breakpoint layout switching, global chrome (scrollbar styling desktop lines 62-79 vs hidden mobile; `select-none`/`antialiased` on desktop body)

**Responsive behavior**
- ≥`md`: three-pane; below `md`: single pane with stack navigation (list ↔ conversation via back button, `history.back()` in the mock → `router.back()`/state in React).
- The two mobile files represent the two states of one responsive screen, not two routes — model as one route with selection state (or `/chats` + `/chats/[id]` routes; either way the components above are shared).
- Safe-area handling (`pt-safe`/`pb-safe`, `viewport-fit=cover`, mobile meta line 1) applies only to the mobile states.

**Notes**
- `data-purpose` attributes present in the source (`navigation-rail`, `chat-sidebar`, `active-chat-pane`, `chat-header`, `messages-stream`, `chat-input-dock`, `search-bar`, `filter-pills`, `recent-chats`, `all-chats-list`) should be preserved on the corresponding React components as test/E2E hooks.
- Tailwind config is embedded per file (desktop lines 19-46; mobile-chatlist lines 12-42; mobile-chat inline line 2) with overlapping but differently-named tokens (`terracotta` vs `terracotta-soft`, `tint-fill` vs `tinted-fill`, `ink-muted` vs `cool-gray`). The React app must consolidate these into one token set in `globals.css` (`@theme inline`) before component work — this is the main source of drift between the three files.
- Script blocks (desktop none; mobile send handler lines 196-217) become React state/effects; do not port imperative scripts.

---

## Cross-cutting extraction candidates

These patterns repeat across components and files; extract once and reuse:

- **Avatar** — w-12 ring (recent strip), w-11 (list rows, group initials variant), w-10 (headers, rail profile), w-8/w-7 (message rows); always with optional presence dot positioned `absolute bottom-0 right-0`. Appears ~20 times across the three files.
- **IconButton** — 44px/36px/32px rounded icon buttons with hover-tint, used by the rail, headers, composer, and call card (~30 instances). Source files acknowledge missing `type`/`title` a11y via biome-ignore comments; fix in React.
- **Icon set** — phone, video, search, kebab, star, check-double, pin, mic, emoji, paperclip, send each appear 2-4 times, sometimes as inline SVG and sometimes as Material Symbols. Normalize to one system.
- **PresenceDot** — emerald/terracotta dot with surface-colored ring, ~10 instances.
- **StatusMeta / mono timestamp** — `font-mono-meta` timestamps appear in every list row and message meta line.

## Notes on the source files

- The three mocks are internally consistent about content: the same 5 conversations, the same 7-message thread with Emily Carter, the same recipient. The React app needs exactly one data model (conversation, message with variants) serving all layouts.
- `chat-page-mobile-chatlist.html`'s device frame, iOS status bar, and home indicator are mock chrome, not app UI. `chat-page-mobile.html`'s safe-area utilities (`pt-safe`, `pb-safe`, line 2 style block) are the real mobile-platform pattern to adopt.
- No source HTML files were modified during this analysis.

## Component names

- LeftIconRail
- BottomTabBar
- ChatsListHeader
- SearchInput
- FilterPills
- RecentChatsStrip
- ConversationListItem
- ConversationsSidebar
- MobileChatListScreen
- ChatHeader
- MessageComposer
- MessageStream
- MessageBubble
- DateSeparator
- CallLogCard
- ChatScreen
