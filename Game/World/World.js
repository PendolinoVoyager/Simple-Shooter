import * as THREE from 'three';
import Environment from './Environment';
import GameMap from './GameMap';
export default class World {
  constructor(game) {
    this.game = game;
    this.#setDefaultGeometries();
    this.#setDefaultMeshMaterial();
    this.environment = new Environment(this);
    this.map = new GameMap(this);
  }
  #setDefaultGeometries() {
    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1, 32, 32);
    this.sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    this.cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32, 32);
  }
  #setDefaultMeshMaterial() {
    this.defaultMeshMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeff,
      roughness: 0.7,
    });
  }
}
