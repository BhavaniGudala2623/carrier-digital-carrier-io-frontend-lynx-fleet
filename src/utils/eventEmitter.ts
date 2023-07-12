import EventEmitter from 'eventemitter3';

let globalEventEmitter: EventEmitter<string | symbol, unknown>;

const getEventEmitter = (): EventEmitter => {
  if (globalEventEmitter) {
    return globalEventEmitter;
  }

  return new EventEmitter();
};

export const eventEmitter = getEventEmitter();
