import ArbLogger from './ArbLogger';
import ArbUtilities from './ArbUtilities';
import ListenerTracker from './ListenerTracker';
import { WebSocketProvider } from 'ethers';

class GracefulExit {

    static setUp(_utils: ArbUtilities): void {

        if (process.platform === 'win32') {
            const readline = require('readline');
            readline.createInterface({
                input: process.stdin,
                output: process.stdout
            }).on('SIGINT', async () => {
                await GracefulExit.shutdown(_utils);
            }); // Listen for CTRL+C (Windows only)

        } else {

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
    }

    static async shutdown(_utils: ArbUtilities): Promise<void> {
        // Shutdown all listeners on exchanges
        console.log('############### GRACEFUL SHUTDOWN COMMENCED ###############');
        try {
            await _utils.tracker.removeAllListeners();
        } catch (ex) {
            console.log(`error removing pair listeners : ${(ex as Error).message}`);
        }

        try {
            process.removeAllListeners();
        } catch (ex) {
            console.log(`error removing process listeners : ${(ex as Error).message}`);
        }

        try {
            _utils.provider.websocket.close();
        } catch (ex) {
            console.log(`error closing provider.WEBSOCKET : ${(ex as Error).message}`);
        }
                           
        _utils.logger.log('info', '################### SHUTDOWN COMPLETE #####################');
        setTimeout(() => {
            console.log('\n################### SHUTDOWN COMPLETE #####################');
        }, 2500);
        setTimeout(process.exit, 2500);
    }
}

export default GracefulExit;