import * as React from 'react';
import * as Three from 'three';
import { createPerspectiveCamera, createOrbitControls, setModelInCenter, fitCameraShowAllModel } from '../../common/helper3d';
import BaseScene from './baseScene';
import _uniqueId from 'lodash/uniqueId';
import _get from 'lodash/get';

const { useRef, useEffect } = React;


const defaultProps = {
  fov: 75,
  height: 500,
  width: 500,
  near: 0.1,
  far: 1000,
  lights: createDefaultLights(),
  modelScale: 1,
}

export type SingleModelSceneProps = {
  model?: Three.Object3D;
  autoRotate?: boolean;
  rotateSpeed?: number;
  modelRotation?: Xyz;
  disableControl?: boolean;
  style?: React.CSSProperties;
} & Partial<typeof defaultProps>

/**
 * 单模型场景
 * 1. 可调整画布（大小，背景），相机（fov, near, far）
 * 2. 支持相机控制器的启用、旋转、调整转速速度
 * 3. 支持传入自定义光源组合
 * 4. 模型自适应剧中，相机位置自动调节展示完整模型（2倍模型高俯视）
 */
export default function SingleModelScene(props: SingleModelSceneProps) {
  const {
    fov, height, width, near, far, style,
    autoRotate, disableControl, rotateSpeed,
    model, lights, modelScale, modelRotation,
  } = props;

  const scene = useRef(new Three.Scene());
  const camera = useRef(createPerspectiveCamera(
    scene.current,
    fov as number,
    (width as number) / (height as number),
    near as number,
    far as number,
  ));
  // const mixer = useRef<Three.AnimationMixer>();
  const renderer = useRef(new Three.WebGLRenderer({ antialias: true, alpha: true }));
  const cameraControl = useRef(createOrbitControls(camera.current, renderer.current));

  const updateControl = () => {
    cameraControl.current.enabled = !Boolean(disableControl);
    cameraControl.current.autoRotate = Boolean(autoRotate);
    cameraControl.current.autoRotateSpeed = _get(props, 'rotateSpeed', 12) / 6;
  }

  const scaleModel = (model?: Three.Object3D) => {
    modelScale && model?.scale.set(modelScale, modelScale, modelScale)
  }

  const rotateModel = (model?: Three.Object3D) => {
    const { x = 0, y = 0, z = 0 } = modelRotation || {};
    model?.rotation.set(x, y, z);
  }

  const addModelToScene = () => {
    if (!model) return;
    if (scene.current.getObjectById(model.id)) {
      scene.current.remove(model);
    }
    scene.current.add(model);
  }

  const updateSize = () => {
    if (!height || !width) return;
    renderer.current.setSize(width, height);

    camera.current.aspect = width / height;
    camera.current.updateProjectionMatrix();
  }

  const initModel = () => {
    addModelToScene();
    model && fitCameraShowAllModel(model, camera.current);
    scaleModel(model);
    rotateModel(model);
    setModelInCenter(model);
  }

  useEffect(() => {
    initModel();
  }, [model, modelScale, modelRotation]);

  useEffect(() => {
    lights?.forEach(light => {
      if (!scene.current.getObjectById(light.id)) {
        scene.current.add(light);
      }
    });
  }, [lights]);

  useEffect(() => {
    updateSize();
  }, [height, width]);

  useEffect(() => {
    updateControl();
  }, [disableControl, autoRotate, rotateSpeed]);

  return (
    <BaseScene
      style={{ height, width, ...style }}
      camera={camera.current}
      scene={scene.current}
      renderer={renderer.current}
      cameraControl={cameraControl.current}
    />
  )
}

SingleModelScene.defaultProps = defaultProps;


function createDefaultLights() {
  const hemiLight = new Three.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 50, 0);

  const dirLight = new Three.DirectionalLight(0xffffff);
  dirLight.position.set(0, 20, 10);

  const ambientLight = new Three.AmbientLight(0xDFDFDF, 0.7)

  return [hemiLight, dirLight, ambientLight];
}