import { EventEmitter } from 'events';
import IGasEstimate from '../interfaces/IGasEstimate';


class EventEmitterGas extends EventEmitter {
    emit(event: 'newGasEstimate', data: IGasEstimate): boolean {
        return super.emit(event, data);
    }

    on(event: 'newGasEstimate', listener: (data: IGasEstimate) => void): this {
        return super.on(event, listener);
    }
}

export default EventEmitterGas;