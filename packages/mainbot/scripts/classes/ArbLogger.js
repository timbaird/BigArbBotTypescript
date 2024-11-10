"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
class ArbLogger {
    constructor(_pairName, _logDir) {
        const fileName = `${_logDir}${_pairName}.log`;
        this.baseLogger = (0, winston_1.createLogger)({
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            transports: []
        });
        console.log(1);
        let fileTransport = this.baseLogger.transports.find((t) => t.filename === fileName);
        console.log(2);
        if (!fileTransport) {
            console.log(3);
            // Add a file transport dynamically with the file name based on the parameter
            fileTransport = new winston_1.transports.File({ filename: fileName, level: 'info' });
            // Temporarily add the file transport
            this.baseLogger.add(fileTransport);
        }
    }
    log(level, message) {
        this.baseLogger.log({ level, message });
        console.log(4);
    }
}
exports.default = ArbLogger;
