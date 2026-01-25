# Research: Google Auth Page Implementation

## Authentication: Better Auth with Google OAuth

- **Decision**: Use Better Auth v1.x with Google Social Provider.
- **Rationale**: User explicitly requested Better Auth. It provides a robust, type-safe authentication layer for Next.js.
- **Implementation Pattern**:
    - **Server initialization**: Create `src/lib/auth.ts` to export the `auth` instance.
    - **API Route**: Implement `src/app/api/auth/[...better-auth]/route.ts`. (Mandatory catch-all for library functionality).
    - **Server Actions**: Use `auth.api.signInSocial` in a Server Action to initiate Google login from the server.
    - **Client usage**: Call the Server Action upon button click. Use `auth.api.getSession` in Server Components for authentication checks.
- **Error Handling**: 
    - Better Auth handles OAuth callback errors by redirecting back with query parameters.
    - We will implement a server-side check (or client-side query param check) to display failure alerts.

## Styling & Theme: Notebook Theme (TweakCN)

- **Decision**: Already applied `https://tweakcn.com/r/themes/notebook.json`.
- **Rationale**: User request. This theme provides a specific hand-drawn/notebook aesthetic using the "Architects Daughter" font.
- **Default Mode**: The user requested a default **dark** theme.
- **Implementation**: 
    - Install `next-themes`.
    - Wrap the application in `ThemeProvider` with `defaultTheme="dark"`.
    - Ensure the auth page layout respects the dark mode variables defined in `globals.css`.

## UI/UX: Auth Page Design

- **Logo**: "antisocial" using the `Architects Daughter` font (variable `--font-sans`).
- **Subtitle**: "JOIN THE QUIET." in uppercase.
- **Login Button**: Shadcn `Button` with a Google icon.
- **Catchy Footer**: "Escape the noise. Join the quiet." centered below the card.
- **Theme Switcher**: A floating or top-corner toggle for Light/Dark mode.

## Dependencies to Add

- `next-themes`: For theme management.
- `lucide-react`: For icons (already in project).
- `better-auth`: For authentication (already in project).
