import cardHandlers from './card/handlers';
import petHandlers from './pet/handlers';
import snapshotHandlers from './snapshot/handlers';

export const handlers = [...cardHandlers, ...petHandlers, ...snapshotHandlers];
