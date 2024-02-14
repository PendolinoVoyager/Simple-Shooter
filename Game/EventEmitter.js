import { EventDispatcher } from 'three';

export default class EventEmitter extends EventTarget {
  #listeners = [];
  constructor() {
    super();
  }
  /**
   * Listens to an event and executes the callback function
   * Important! It will only listens to events on itself and not from other EventEmitters!
   * @param {String} event Event to listen to
   * @param {Function} callback Event handler function
   */
  on(event, callback) {
    this.#listeners.push({ event, callback });
    this.addEventListener(event, callback);
  }

  /**
   * Removes the event listener for the specified event
   * @param {String} event Event type
   * @param {Function} callback Event handler function to remove (optional)
   */
  off(event, callback = null) {
    if (!callback) {
      this.#listeners
        .filter((l) => l.event === event)
        .forEach(({ event, callback }) => {
          this.removeEventListener(event, callback);
        });
      this.#listeners = this.#listeners.filter((l) => l.event !== event);
      return;
    }

    const listener = this.#listeners.find(
      (l) => l.event === event && l.callback === callback
    );
    if (listener) {
      this.removeEventListener(listener.event, listener.callback);
      this.#listeners = this.#listeners.filter((l) => l !== listener);
    }
  }
  offAll() {
    this.#listeners.forEach(({ event, callback }) => {
      this.removeEventListener(event, callback);
    });
  }
  /**
   * Dispatches an event of the specified type with optional data
   * @param {String} eventName Event type
   * @param {*} params Optional data to pass with the event
   */
  emit(eventName, params = {}) {
    const e = new Event(eventName);
    e.params = params;
    this.dispatchEvent(e);
  }

  /**
   * Returns all registered listeners
   * @returns {Array} Array of listener objects
   */
  getAllListeners() {
    return this.#listeners;
  }
}
