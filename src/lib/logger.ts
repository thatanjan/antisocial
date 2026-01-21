import pino from "pino";

/**
 * Pino logger instance for structured logging across the application.
 * Configured with pino-pretty for development environments and follows LOG_LEVEL env var.
 */
export const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport:
        process.env.NODE_ENV === "development"
            ? {
                target: "pino-pretty",
                options: {
                    colorize: true,
                },
            }
            : undefined,
});
