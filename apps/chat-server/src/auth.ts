import { auth } from "@antisocial/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import type { Socket } from "socket.io";

export const getUserSession = (
  headers: Parameters<typeof fromNodeHeaders>[0],
) => auth.api.getSession({ headers: fromNodeHeaders(headers) });

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof getUserSession>>
>;
export type AuthUser = AuthSession["user"];

declare global {
  namespace Express {
    interface Locals {
      session: AuthSession;
    }
  }
}

declare module "socket.io" {
  interface SocketData {
    session: AuthSession;
  }
}

export const requireAuth = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getUserSession(request.headers);
    if (!session) {
      response.sendStatus(401);
      return;
    }

    response.locals.session = session;
    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateSocket = async (
  socket: Socket,
  next: (error?: Error) => void,
) => {
  try {
    const session = await getUserSession(socket.handshake.headers);
    if (!session) {
      next(new Error("unauthorized"));
      return;
    }

    socket.data.session = session;
    next();
  } catch {
    next(new Error("unauthorized"));
  }
};
