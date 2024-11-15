"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListenerTracker {
    constructor(logger) {
        this.listeners = new Map();
        this.logger = logger;
    }
    /**
     * Adds an event listener and tracks it.
     * @param poolName - string - The name of the pool the listening pair is related to
     * @param target - pool object - The object to add a listener to.
     * @param event - string e.g swap - The event name to listen to.
     * @param listener - function - The listener function.
     */
    addListener(pairName, poolName, target, event, listener) {
        const listenerName = `${pairName}_${poolName}_${event}`.toLowerCase();
        // Check if a listener is already set for this exchange
        if (!this.listeners.has(listenerName)) {
            target.on(event, listener);
            this.listeners.set(listenerName, [{ target, event, listener }]);
            this.logger.log('info', `ListenerTracker.addListener:  ${event} event listener added to ${listenerName}`);
        }
        else {
            this.logger.log('info', `### ListenerTracker.addListener: ${event} event listener ALREADY EXISTS for ${listenerName}`);
        }
    }
    /**
     * Removes all tracked listeners.
     */
    async removeAllListeners() {
        // for every tracked listener
        for (const [listenerName, listenerInfo] of this.listeners) {
            // this should only loop once
            for (const { target, event, listener } of listenerInfo) {
                await target.removeAllListeners();
                this.logger.log('info', `ListenerTracker.removeAllListeners: ${listenerName} pool has ${await target.listenerCount(event)} listeners AFTER removal`);
            }
        }
        // Clear the map after removing listeners
        this.listeners.clear();
    }
}
exports.default = ListenerTracker;
