import EventEmitter from '../EventEmitter';
export default class GlobalClock extends EventEmitter {
  constructor() {
    super();
    this.paused = true;
    this.slowClock = 1;
    this.startTime = Date.now();
    this.current = this.startTime;
    this.elapsed = 0;
    this.deltaTime = 16;
  }
  start() {
    this.paused = false;
    this.#tick();
  }
  stop() {
    this.paused = true;
  }
  reset() {
    this.paused = true;
    this.startTime = Date.now();
    this.current = this.startTime;
    this.elapsed = 0;
    this.deltaTime = 16;
  }
  #tick() {
    const currentTime = Date.now();
    this.deltaTime = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = currentTime - this.startTime;
    if (this.slowClock > 10) {
      this.emit('slowTick');
      this.slowClock = 0;
    } else this.slowClock++;
    this.emit('tick');
    !this.paused && window.requestAnimationFrame(this.#tick.bind(this));
  }
}
