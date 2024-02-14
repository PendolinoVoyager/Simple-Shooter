import * as THREE from 'three';
import debugGUI from './Utils/Debug';
import Sizes from './Utils/Sizes';
import Camera from './Utils/Camera';
import GlobalClock from './Utils/GlobalClock';
import Renderer from './Renderer';
import World from './World/World';
import PhysicsWorld from './Physics/PhysicsWorld';
import ObjectManager from './Utils/ObjectManager';
import Player from './Player/Player';
import CameraControls from './Utils/CameraControls';
import resources from './Resources/resources';

export default class Game {
  #players = [];
  #mainPlayer;
  constructor(canvas) {
    this.socket = window.socket;
    delete window.socket;
    this.debugGUI = new debugGUI();
    this.resources = resources;
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.scene = new THREE.Scene();
    this.globalClock = new GlobalClock();
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    //TODO: Load resourecs
    this.world = new World(this);
    this.physicsWorld = new PhysicsWorld(this);

    this.objectManager = new ObjectManager(this);
    this.#resize();
    this.#addDefaultListeners();

    this.spawnPlayer(true);
    this.cameraControls = new CameraControls(
      this.canvas,
      this.camera.instance
    ).follow(this.#mainPlayer);
    this.#addGlobalDebugItems();
    this.globalClock.start();
  }

  #addDefaultListeners() {
    this.sizes.on('resize', this.#resize.bind(this));
    this.globalClock.on('tick', this.#gameLoop.bind(this));
    this.globalClock.on('slowTick', this.#slowGameLoop.bind(this));
  }
  #resize() {
    this.renderer.instance.setSize(this.sizes.width, this.sizes.height);
    this.camera.instance.aspect = this.sizes.aspect;
    this.camera.instance.updateProjectionMatrix();
  }
  #gameLoop() {
    this.physicsWorld.update();
    this.objectManager.update();
    this.cameraControls.update();
    this.#mainPlayer.update();
    this.#players.forEach((p) => p.update());
    this.renderer.render();
  }
  #slowGameLoop() {
    this.#players.forEach((p) => p.slowUpdate());
  }
  #addGlobalDebugItems() {
    this.debugGUI.gui.add(this.globalClock, 'start');
    this.debugGUI.gui.add(this.globalClock, 'stop');
  }
  #setupConnection() {}
  spawnPlayer(main = false) {
    const player = new Player(this, main);
    if (main) this.#mainPlayer = player;
    else this.#players.push(player);
  }
}
