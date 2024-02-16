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
  players = [];
  #mainPlayer;
  constructor(canvas) {
    this.globalClock = new GlobalClock();
    this.socket = window.socket;

    this.debugGUI = new debugGUI();
    this.resources = resources;
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    //TODO: Load resourecs
    this.world = new World(this);
    this.physicsWorld = new PhysicsWorld(this);

    this.objectManager = new ObjectManager(this);
    this.#resize();
    this.#addDefaultListeners();

    this.spawnPlayer(true, null);
    this.#setupConnection();
    delete window.socket;
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
    this.renderer.render();
  }
  #slowGameLoop() {
    this.#mainPlayer.slowUpdate();
    this.players.forEach((p) => p.updateFromState());
  }
  #addGlobalDebugItems() {
    this.debugGUI.gui.add(this.globalClock, 'start');
    this.debugGUI.gui.add(this.globalClock, 'stop');
  }
  #setupConnection() {
    this.socket.emit('initial state', this.#mainPlayer.state);
    this.globalClock.on('slowTick', () => {
      this.socket.emit('slowTick', this.#mainPlayer.state);
    });
    this.socket.on('add player', (newPlayerState) => {
      if (newPlayerState.id === this.#mainPlayer.state.id) return;
      this.spawnPlayer(false, newPlayerState.id);
    });
    this.socket.on('players update', (data) => {
      console.log(data);
      for (const state of data) {
        const player = this.players.find((p) => p?.state?.id === state.id);
        if (!player) return;
        player.state = state;
      }
    });
    this.socket.on('disconnect player', (id) => this.#deletePlayer(id));
  }

  spawnPlayer(main = false, id) {
    const player = new Player(this, main, id);
    if (main) this.#mainPlayer = player;
    else this.players.push(player);
  }

  #deletePlayer(id) {
    const i = this.players.findIndex((p) => p.id === id);
    const player = this.players[i];
    player.instance.mesh.material.dispose();
    this.scene.remove(player.instance.mesh);
    this.physicsWorld.physicsWorld.removeBody(player.instance.body);
    this.players.splice(
      this.players.findIndex((p) => p.id === id),
      1
    );
  }
}
