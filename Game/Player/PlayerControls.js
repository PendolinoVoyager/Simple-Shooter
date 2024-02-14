export default class PlayerControls {
  keys = { left: false, right: false, up: false, down: false, jump: false };
  maps = {
    left: ['ArrowLeft', 'a'],
    right: ['ArrowRight', 'd'],
    up: ['ArrowUp', 'w'],
    down: ['ArrowDown', 's'],
    jump: [' '],
  };
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.#addKeyDownListeners();
    this.#addKeyUpListeners();
    window.addEventListener('blur', () => {
      Object.keys(this.keys).forEach((k) => (this.keys[k] = false));
    });
  }
  #addKeyDownListeners() {
    window.addEventListener('keydown', (e) => {
      Object.entries(this.maps).forEach(([key, inputs]) => {
        if (inputs.includes(e.key)) {
          this.keys[key] = true;
          return;
        }
      });
    });
  }
  #addKeyUpListeners() {
    window.addEventListener('keyup', (e) => {
      Object.entries(this.maps).forEach(([key, inputs]) => {
        if (inputs.includes(e.key)) {
          this.keys[key] = false;

          return;
        }
      });
    });
  }

  update() {
    Object.entries(this.keys).forEach(([key, value]) => {
      this.player.state.keys[key] = value;
    });
  }
}
