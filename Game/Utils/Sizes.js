import EventEmitter from '../EventEmitter';

export default class Sizes extends EventEmitter {
  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = window.devicePixelRatio;
    window.addEventListener('resize', this.#changeSizes.bind(this));
  }
  #changeSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = window.devicePixelRatio;
    this.emit('resize');
  }
}
