import { EventEmitter } from 'events';
import ArbLogger from './ArbLogger';
import { Contract } from 'ethers';
import IListenerInfo from '../interfaces/IListenerInfo';

class ListenerTracker {
    // maps the pool name string againstt he listener 
    private listeners: Map<string, IListenerInfo[]>;
    private logger: ArbLogger;

    constructor(logger: ArbLogger) {
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
  addListener(poolName: string, target: Contract, event: string, listener: (...args: any[]) => void): void {
    
    const listenerName: string = `${poolName}_${event}`.toLowerCase();

        // Check if a listener is already set for this exchange
        if (!this.listeners.has(listenerName)) {
            target.on(event, listener);
            this.listeners.set(listenerName, [{ poolName, target, event, listener }]);
            this.logger.log('info', `ListenerTracker.addListener:  ${event} event listener added to ${poolName}`);
        } else {
            this.logger.log('info', `ListenerTracker.addListener: ${event} event listener ALREADY EXISTS for ${poolName}`);
        }
    }

    /**
     * Removes all tracked listeners.
     */
  async removeAllListeners(): Promise<void> {
      // for every tracked listener
      for (const [listenerName, listenerInfo] of this.listeners) {
            // this should only loop once
            for (const { poolName, target, event, listener } of listenerInfo) {
                await target.removeAllListeners();
                this.logger.log('info',`ListenerTracker.removeAllListeners: ${poolName} pool has ${await target.listenerCount(event)} listeners AFTER removal`);
            }
        }
        // Clear the map after removing listeners
        this.listeners.clear();
    }
}

export default ListenerTracker;