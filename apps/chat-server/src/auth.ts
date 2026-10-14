import type { Socket } from "socket.io";

interface VerifiedUser {
  id: string;
  email: string;
}

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "";

/**
 * Verify a session token by calling the parent app's Better Auth API.
 */
export const verifyToken = async (
  token: string,
): Promise<VerifiedUser | null> => {
  try {
    const url = `${BETTER_AUTH_URL}/api/auth/get-session`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: `better-auth.session_token=${token};`,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const user = data?.user;
    if (!user?.id) return null;

    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
};

/**
 * Socket.IO authentication middleware factory.
 * Requires `token` query param on socket handshake.
 */
export const authMiddleware = (
  io: ReturnType<typeof import("socket.io")>["Server"],
) => {
  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      socket.disconnect(true);
      return next(new Error("Authentication required: missing token"));
    }

    const user = await verifyToken(token);
    if (!user) {
      socket.disconnect(true);
      return next(new Error("Authentication failed: invalid or expired token"));
    }

    // Attach user to socket context
    (socket as unknown as Record<string, unknown>).data.user = user;
    next();
  });
};
