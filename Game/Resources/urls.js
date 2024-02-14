const urls = [
  {
    name: 'environmentMap',
    loader: 'rgbe',
    type: 'envMap',
    url: '/textures/3/2k.hdr',
  },
  {
    name: 'playerModel',
    loader: 'fbx',
    type: 'fbx',
    url: '/models/Y Bot.fbx',
  },
  {
    name: 'walk',
    loader: 'fbx',
    type: 'playerAnimation',
    url: '/animations/walking.fbx',
  },
  {
    name: 'rifle run',
    loader: 'fbx',
    type: 'playerAnimation',
    url: '/animations/rifle-run.fbx',
  },
  {
    name: 'rifle aiming idle',
    loader: 'fbx',
    type: 'playerAnimation',
    url: '/animations/rifle-aiming-idle.fbx',
  },
];

export default urls;
