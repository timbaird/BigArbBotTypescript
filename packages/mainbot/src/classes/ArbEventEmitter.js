"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class ArbEventEmitter extends events_1.EventEmitter {
    emit(event, data) {
        return super.emit(event, data);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
}
exports.default = ArbEventEmitter;
