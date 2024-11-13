"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
class ArbLogger {
    constructor(_pairName, _logDir, _debug) {
        this.debug = _debug;
        const formattedDate = this.getFormattedDate();
        const fileName = `${_logDir}${_pairName}_${formattedDate}.log`;
        this.baseLogger = (0, winston_1.createLogger)({
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            transports: []
        });
        let fileTransport = this.baseLogger.transports.find((t) => t.filename === fileName);
        if (!fileTransport) {
            // Add a file transport dynamically with the file name based on the parameter
            fileTransport = new winston_1.transports.File({ filename: fileName, level: 'info' });
            // Temporarily add the file transport
            this.baseLogger.add(fileTransport);
        }
    }
    log(level, message, overrideDebug = false) {
        this.baseLogger.log({ level, message });
        this.debug || overrideDebug ? console.log(message) : null;
    }
    getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}_${month}_${day}`;
    }
}
exports.default = ArbLogger;
