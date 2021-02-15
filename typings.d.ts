declare module '*.css';
declare module '*.less';

type Xyz = { x: number, y: number, z: number };

type MaterialType = 'MeshBasicMaterial' | 'MeshNormalMaterial' | 'MeshStandardMaterial' |
  'MeshPhongMaterial' | 'MeshLambertMaterial' | 'MeshToonMaterial';  

type LightType = 'AmbientLight' | 'PointLight' | 'SpotLight' | 'DirectionalLight' | 'HemisphereLight' | 'AreaLight';