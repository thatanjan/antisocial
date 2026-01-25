# Quickstart: Google Auth Page

## Prerequisites

1.  **Google OAuth Credentials**:
    -   Go to [Google Cloud Console](https://console.cloud.google.com/).
    -   Create a new project.
    -   Set up OAuth consent screen.
    -   Create Credentials -> OAuth Client ID (Web Application).
    -   Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`.
    -   Get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

2.  **Environment Variables**:
    Update your `.env` file:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/antisocial"
    BETTER_AUTH_SECRET="your-secret-here"
    BETTER_AUTH_URL="http://localhost:3000"
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
    ```

## Development Steps

1.  **Install Dependencies**:
    ```bash
    npm install next-themes
    ```

2.  **Database Setup**:
    ```bash
    # Automatically add Better Auth models to schema.prisma
    npx @better-auth/cli generate

    # Generate client and sync database
    npx prisma generate
    npx prisma db push
    ```

3.  **Run Dev Server**:
    ```bash
    npm run dev
    ```

4.  **Test Auth Page**:
    -   Navigate to `/login` (or root page redirecting to login).
    -   Toggle light/dark mode.
    -   Click "Continue with Google".
    -   Verify successful login and session creation.

## Troubleshooting

-   **Redirect Mismatch**: Ensure `BETTER_AUTH_URL` matches exactly with the Google Cloud Console redirect URI.
-   **Invalid Secret**: Generate a secure secret for `BETTER_AUTH_SECRET` (e.g., `openssl rand -base64 32`).
