import petHandlers from './pet/handlers';
import snapshotHandlers from './snapshot/handlers';

export const handlers = [...petHandlers, ...snapshotHandlers];
