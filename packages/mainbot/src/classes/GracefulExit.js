"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GracefulExit {
    static setUp(_utils) {
        if (process.platform === 'win32') {
            const readline = require('readline');
            readline.createInterface({
                input: process.stdin,
                output: process.stdout
            }).on('SIGINT', async () => {
                await GracefulExit.shutdown(_utils);
            }); // Listen for CTRL+C (Windows only)
        }
        else {
            process.on('SIGINT', async () => {
                _utils.logger.log('info', 'SIGINT received, shutting down');
                await GracefulExit.shutdown(_utils);
            });
            process.on('SIGTERM', async () => {
                _utils.logger.log('info', 'SIGTERM received, shutting down');
                await GracefulExit.shutdown(_utils);
            });
            process.on('SIGQUIT', async () => {
                _utils.logger.log('info', 'SIGQUIT received, shutting down');
                await GracefulExit.shutdown(_utils);
            });
        }
        _utils.logger.log("info", "GracefulExit: setup executed");
    }
    static async shutdown(_utils) {
        // Shutdown all listeners on exchanges
        _utils.logger.log('info', '############### GRACEFUL SHUTDOWN COMMENCED ###############', true);
        try {
            await _utils.tracker.removeAllListeners();
        }
        catch (ex) {
            _utils.logger.log('info', `GracefulExit.shutdown: error removing pair listeners : ${ex.message}`, true);
        }
        try {
            process.removeAllListeners();
        }
        catch (ex) {
            _utils.logger.log('info', `GracefulExit.shutdown: error removing process listeners : ${ex.message}`, true);
        }
        try {
            _utils.provider.websocket.close();
        }
        catch (ex) {
            _utils.logger.log('info', `GracefulExit.shutdown: error closing provider.WEBSOCKET : ${ex.message}`, true);
        }
        setTimeout(() => {
            _utils.logger.log('info', '################### SHUTDOWN COMPLETE #####################', true);
        }, 2500);
        setTimeout(process.exit, 2500);
    }
}
exports.default = GracefulExit;
