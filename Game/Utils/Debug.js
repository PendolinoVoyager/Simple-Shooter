import GUI from 'lil-gui';
export default class Debug {
  constructor() {
    this.gui = new GUI({ closeFolders: true });
    this.gui.show(window.location.hash === '#debug');
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#debug') this.gui.show(true);
      else this.gui.show(false);
    });
  }
}
