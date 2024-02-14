import * as THREE from 'three';
export default class Environment {
  #debugProps = { envMapIntensity: 1 };
  #debugFolder;
  constructor(world) {
    this.world = world;
    this.#debugFolder = this.world.game.debugGUI.gui.addFolder('Environment');
    this.#setDirectionalLight();
    this.#setEnvMap();
    this.#addDebugElements();
  }
  #setDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight('white', 3);
    this.directionalLight.shadow.camera.near = 0.1;
    this.directionalLight.shadow.camera.far = 100;
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.position.set(3, 3, 1);
    this.directionalLightHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    );

    this.world.game.scene.add(
      this.directionalLight,
      this.directionalLightHelper
    );
  }
  #setEnvMap() {
    const envMap = this.world.game.resources.find(
      (r) => r.name === 'environmentMap'
    ).data;
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    this.world.game.scene.environment = envMap;
    this.world.game.scene.background = envMap;
  }
  #updateEnvMapIntensity(x) {
    this.world.game.scene.traverse((c) => {
      if (!c.isMesh) return;
      c.material.envMapIntensity = x;
    });
  }
  #addDebugElements() {
    this.#debugFolder
      .add(this.#debugProps, 'envMapIntensity', 0, 10)
      .onChange(this.#updateEnvMapIntensity.bind(this));
    this.#debugFolder
      .add(this.directionalLight, 'intensity', 0, 30)
      .name('Sunlight intensity');
    this.#debugFolder
      .addColor(this.directionalLight, 'color')
      .name('Sun color');
  }
}
