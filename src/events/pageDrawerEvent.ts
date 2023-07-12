import { eventEmitter } from '@/utils/eventEmitter';

export const PAGE_DRAWER_EVENT = 'page-drawer-event';

const toggle = (): void => {
  eventEmitter.emit(PAGE_DRAWER_EVENT);
};

const subscribe = (callback?: () => void): void => {
  eventEmitter.on(PAGE_DRAWER_EVENT, () => callback && callback());
};

const unsubscribe = (): void => {
  eventEmitter.off(PAGE_DRAWER_EVENT);
};

export const PageDrawerEvent = {
  toggle,
  subscribe,
  unsubscribe,
};
