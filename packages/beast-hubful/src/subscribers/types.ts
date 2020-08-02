// Types
import { TStorageServicePayload } from '../storages';

export type TSubscribeHandler<T = TStorageServicePayload> = (topic: string, payload: T) => Promise<void>;
