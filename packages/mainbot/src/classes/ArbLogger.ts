import { boolean } from 'hardhat/internal/core/params/argumentTypes';
import { createLogger, transports, format, Logger, transport } from 'winston';

class ArbLogger {
    baseLogger: Logger;
    debug: boolean;

    constructor(_pairName: string, _logDir: string, _debug: boolean) {
        this.debug = _debug;
        const formattedDate = this.getFormattedDate()

        const fileName = `${_logDir}${_pairName}_${formattedDate}.log`;

        this.baseLogger = createLogger({
            format: format.combine(format.timestamp(), format.json()),
            transports: []
        });
        
        let fileTransport = this.baseLogger.transports.find(
            (t: any) => (t as any).filename === fileName
        ) as transports.FileTransportInstance | undefined;

        if (!fileTransport) {
            // Add a file transport dynamically with the file name based on the parameter
            fileTransport = new transports.File({ filename: fileName, level: 'info' });
            // Temporarily add the file transport
            this.baseLogger.add(fileTransport);
        }
    }

    log(level: string, message: string, overrideDebug:boolean = false): void {
        this.baseLogger.log({ level, message });
        this.debug || overrideDebug ? console.log(message) : null;
    }

    getFormattedDate(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}_${month}_${day}`;
    }

}

export default ArbLogger;