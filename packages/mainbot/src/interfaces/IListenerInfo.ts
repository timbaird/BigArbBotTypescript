import { Contract } from 'ethers';

interface IListenerInfo {
    poolName: string;
    target: Contract;
    event: string;
    listener: (...args: any[]) => void;
}

export default IListenerInfo;