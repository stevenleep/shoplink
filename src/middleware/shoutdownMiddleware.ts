import { Server } from 'http';
import logger from "@/utils/logger";
import e from 'express';

// Graceful shutdown handler
const gracefulShutdown = async (server: Server, signal: string) => {
    logger.info(`${signal} signal received. Starting graceful shutdown...`);

    // Close server
    server.close(() => {
        logger.info('HTTP server closed.');
    });

    try {
        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
};

/**
 * 优雅关闭
 */
export const shutdownSignalsHandler = async (server: Server) => {
    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown(server, 'SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
        logger.error('Uncaught Exception:', error);
        gracefulShutdown(server, 'UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown) => {
        logger.error('Unhandled Rejection:', reason);
        gracefulShutdown(server, 'UNHANDLED_REJECTION');
    });
}

export default shutdownSignalsHandler;