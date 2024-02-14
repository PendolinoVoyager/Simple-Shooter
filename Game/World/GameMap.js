import * as THREE from 'three';

export default class GameMap {
  constructor(world) {
    this.world = world;
    this.#setFloor();
  }
  #setFloor() {
    const geeometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({ roughness: 0.7 });
    const floor = new THREE.Mesh(geeometry, material);
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 1;
    floor.receiveShadow = true;
    const copy = new THREE.Mesh(geeometry, material);
    copy.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 1.4);
    this.gameMap = new THREE.Group();
    copy.position.z = 40;
    copy.receiveShadow = true;

    this.gameMap.add(floor, copy);
    this.world.game.scene.add(this.gameMap);
  }
  destroy() {
    return;
  }
}
