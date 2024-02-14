import Game from '../Game/Game.js';
import resources from '../Game/Resources/resources.js';
import urls from '../Game/Resources/urls.js';

import { FBXLoader } from '../node_modules/three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from '../node_modules/three/examples/jsm/loaders/RGBELoader';
import { TextureLoader } from '../node_modules/three';

class Resource {
  constructor(name, type, data) {
    this.name = name;
    this.type = type;
    this.data = data;
  }
}
const init = async function () {
  const loaders = new Map([
    ['fbx', new FBXLoader()],
    ['gltf', new GLTFLoader()],
    ['rgbe', new RGBELoader()],
    ['texture', new TextureLoader()],
  ]);
  const promises = [];
  renderLoading();
  try {
    urls.forEach((resource) => {
      promises.push(loaders.get(resource.loader).loadAsync(resource.url));
    });
    const data = await Promise.all(promises);
    urls.forEach((resource, i) => {
      resources.push(new Resource(resource.name, resource.type, data[i]));
    });
    document.querySelector('.loadingScreen')?.remove();
    const game = new Game(document.querySelector('canvas#game'));
    window.game = game;
  } catch (err) {
    renderError();
    console.error(err);
  }
};
init();

function renderLoading() {
  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('loadingScreen');
  loadingDiv.innerText = 'Loading ...';
  document.body.appendChild(loadingDiv);
}

function renderError() {
  document.querySelector('.loadingScreen')?.remove();

  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('loadingScreen');
  loadingDiv.innerText = 'Error fetching resources! Please try again.';
  document.body.appendChild(loadingDiv);
}
