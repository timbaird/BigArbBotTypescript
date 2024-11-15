import { Contract } from 'ethers';

interface IListenerInfo {
    target: Contract;
    event: string;
    listener: (...args: any[]) => void;
}

export default IListenerInfo;