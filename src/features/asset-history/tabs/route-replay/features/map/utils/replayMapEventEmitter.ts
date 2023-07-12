export const replayMapEventEmitter = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
  removeAll(events) {
    events.forEach((event) => this.remove(event, () => {}));
  },
};
