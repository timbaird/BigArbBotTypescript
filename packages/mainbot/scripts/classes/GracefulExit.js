"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GracefulExit {
    static setUp(tracker, provider, logger) {
        if (process.platform === 'win32') {
            const readline = require('readline');
            readline.createInterface({
                input: process.stdin,
                output: process.stdout
            }).on('SIGINT', async () => {
                await GracefulExit.shutdown(tracker, provider, logger);
            }); // Listen for CTRL+C (Windows only)
        }
        else {
            process.on('SIGINT', async () => {
                logger.log('info', 'SIGINT received, shutting down');
                await GracefulExit.shutdown(tracker, provider, logger);
            });
            process.on('SIGTERM', async () => {
                logger.log('info', 'SIGTERM received, shutting down');
                await GracefulExit.shutdown(tracker, provider, logger);
            });
            process.on('SIGQUIT', async () => {
                logger.log('info', 'SIGQUIT received, shutting down');
                await GracefulExit.shutdown(tracker, provider, logger);
            });
        }
    }
    static async shutdown(tracker, provider, logger) {
        // Shutdown all listeners on exchanges
        console.log('################### GRACEFUL SHUTDOWN COMMENCED #####################');
        try {
            await tracker.removeAllListeners();
        }
        catch (ex) {
            console.log(`error removing pair listeners : ${ex.message}`);
        }
        try {
            process.removeAllListeners();
        }
        catch (ex) {
            console.log(`error removing process listeners : ${ex.message}`);
        }
        try {
            provider.websocket.close();
        }
        catch (ex) {
            console.log(`error closing provider.WEBSOCKET : ${ex.message}`);
        }
        logger.log('info', '################### SHUTDOWN COMPLETE #####################');
        setTimeout(() => {
            console.log('\n################### SHUTDOWN COMPLETE #####################');
        }, 2500);
        setTimeout(process.exit, 3000);
    }
}
exports.default = GracefulExit;
