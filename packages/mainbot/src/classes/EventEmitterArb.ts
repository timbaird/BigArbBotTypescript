import { EventEmitter } from 'events';
import IArbExecutionParams from '../interfaces/IArbExecutionParams';

class EventEmitterArb extends EventEmitter {
    emit(event: 'arbitrageDetected', data: IArbExecutionParams): boolean {
        return super.emit(event, data);
    }

    on(event: 'arbitrageDetected', listener: (data: IArbExecutionParams) => void): this {
        return super.on(event, listener);
    }

}

export default EventEmitterArb;