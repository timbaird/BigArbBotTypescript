import { EventEmitter } from 'events';
import ISwapEventData from '../interfaces/ISwapEventData';
import IArbEventData from '../interfaces/IArbData';

class EventEmitterSwap extends EventEmitter {
    emit(event: 'internalSwapEvent', data: ISwapEventData): boolean {
        return super.emit(event, data);
    }

    on(event: 'internalSwapEvent', listener: (data: ISwapEventData) => void): this {
        return super.on(event, listener);
    }

    // on(event: 'arbFoundEvent', listener: (data: IArbEventData) => void): this {
    //     return super.on(event, listener);
    // }
}

export default EventEmitterSwap;