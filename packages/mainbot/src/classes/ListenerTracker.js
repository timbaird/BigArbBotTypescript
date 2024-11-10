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
    addListener(poolName, target, event, listener) {
        const listenerName = `${poolName}_${event}`.toLowerCase();
        // Check if a listener is already set for this exchange
        if (!this.listeners.has(listenerName)) {
            target.on(event, listener);
            this.listeners.set(listenerName, [{ poolName, target, event, listener }]);
            //console.log(`${event} event listener SET UP for for ${poolName}`);
            this.logger.log('info', `ListenerTracker : ${event} event listener added to ${poolName}`);
        }
        else {
            console.log(`${event} event listener ALREADY EXISTS for ${poolName}`);
            this.logger.log('info', `ListenerTracker : attempt to add duplicate ${event} event listener to ${poolName}`);
        }
    }
    /**
     * Removes all tracked listeners.
     */
    async removeAllListeners() {
        // for every tracked listener
        for (const [listenerName, listenerInfo] of this.listeners) {
            // this should only loop once
            for (const { poolName, target, event, listener } of listenerInfo) {
                await target.removeAllListeners();
                this.logger.log('info', `ListenerTracker.removeAllListeners : ${poolName} pool has ${await target.listenerCount(event)} listeners AFTER removal`);
            }
        }
        // Clear the map after removing listeners
        this.listeners.clear();
    }
}
exports.default = ListenerTracker;
