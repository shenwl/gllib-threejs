import * as Three from 'three';
import { Object3D } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


const { Box3, Vector3 } = Three;

export function createOrbitControls(camera: Three.Camera, renderer: Three.Renderer, opts?: object) {
  const control = new OrbitControls(camera, renderer.domElement);

  control.maxPolarAngle = Math.PI * 0.5;
  control.enableDamping = true;
  control.enableZoom = false;

  Object.entries(opts || {}).forEach(([k, v]) => {
    (control as any)[k] = v;
  });
  return control;
}

/**
 * 获取模型的中心点和尺寸
 * @param model 
 */
export function getModelCenterAndSize(model: Three.Object3D) {
  const box = new Box3().setFromObject(model);
  const center = new Vector3();
  const size = new Vector3();
  box.expandByObject(model);

  box.getCenter(center);
  box.getSize(size);

  return {
    center,
    size
  };
}

/**
 * 设置模型位置居中
 * @param model 
 */
export function setModelInCenter(model?: Three.Object3D) {
  if (!model) return;
  const { center } = getModelCenterAndSize(model);
  model.position.x = model.position.x - center.x;
  model.position.y = model.position.y - center.y;
  model.position.z = model.position.z - center.z;
}

export function fitCameraShowAllModel(
  model: Object3D, camera: Three.Camera, 
  fov: number = 75, cameraHight = 1.5,
  ) {
  const { size } = getModelCenterAndSize(model);
  const dist = size.y / (2 * Math.tan(Math.PI * fov / 360));
  const pos = model.position;

  const cameraX = pos.x + size.x * 1.5;
  const cameraY = pos.y + size.y * cameraHight;
  const cameraZ = dist + size.z;

  camera.position.set(cameraX, cameraY, cameraZ);
  camera.lookAt(pos);
}

export function createPerspectiveCamera(scene: Three.Scene, fov: number, aspect: number, near: number, far: number) {
  const camera = new Three.PerspectiveCamera(fov, aspect, near, far);
  camera.lookAt(scene.position);
  return camera;
}

/**
 * 给模型贴上材质
 * @param model 
 * @param material 
 */
export function setMaterial(model?: Object3D, material?: Three.Material) {
  if (!material) return;
  model?.traverse(child => {
    if (child instanceof Three.Mesh) {
      child.material = material;
    }
  })
}
