import { createLogger, transports, format, Logger, transport } from 'winston';

class ArbLogger {
    baseLogger: Logger;

    constructor(_pairName: string, _logDir: string) {
        const fileName = `${_logDir}${_pairName}.log`;

        this.baseLogger = createLogger({
            format: format.combine(format.timestamp(), format.json()),
            transports: []
        });
        
        console.log(1);
        let fileTransport = this.baseLogger.transports.find(
            (t: any) => (t as any).filename === fileName
        ) as transports.FileTransportInstance | undefined;

        console.log(2);
        if (!fileTransport) {
            console.log(3);
            // Add a file transport dynamically with the file name based on the parameter
            fileTransport = new transports.File({ filename: fileName, level: 'info' });
            // Temporarily add the file transport
            this.baseLogger.add(fileTransport);
        }
    }

    log(level: string, message: string): void {
        this.baseLogger.log({ level, message });
        console.log(4);
    }
}

export default ArbLogger;