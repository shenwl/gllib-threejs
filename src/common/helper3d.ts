import * as Three from 'three';

const { Box3, Vector3 } = Three;

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
export function setModelInCenter(model: Three.Object3D) {
  const { center } = getModelCenterAndSize(model);
  model.position.x = model.position.x - center.x;
  model.position.y = model.position.y - center.y;
  model.position.y = model.position.y - center.y;
}
