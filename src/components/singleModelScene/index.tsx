import * as React from 'react';
import * as Three from 'three';
import { createPerspectiveCamera, createOrbitControls } from '../../common/helper3d';
import _uniqueId from 'lodash/uniqueId';
import _get from 'lodash/get';

const { useRef, useEffect } = React;


const defaultProps = {
  fov: 0.75,
  height: 500,
  width: 500,
  near: 0.1,
  far: 1000,
  lights: createDefaultLights(),
}

type SingleModelSceneProps = {
  model?: Three.Object3D;
  autoRotate?: boolean;
  rotateSpeed?: number;
  modelRotation?: Xyz;
  disableControl?: boolean;
  style?: React.CSSProperties;
} & Partial<typeof defaultProps>


export default function SingleModelScene(props: SingleModelSceneProps) {
  const {
    fov, height, width, near, far, style,
    autoRotate, disableControl,
    model, lights,
  } = Object.assign({}, props, defaultProps);

  const id = useRef('model-scene' + _uniqueId());
  const umount = useRef(false);

  const scene = useRef(new Three.Scene());
  const camera = useRef(createPerspectiveCamera(scene.current, fov, width / height, near, far))
  // const mixer = useRef<Three.AnimationMixer>();
  const renderer = useRef(new Three.WebGLRenderer({ antialias: true, alpha: true }));
  const cameraControl = useRef(createOrbitControls(camera.current, renderer.current));

  const updateControl = () => {
    cameraControl.current.enabled = !Boolean(disableControl);
    cameraControl.current.autoRotate = Boolean(autoRotate);
    cameraControl.current.autoRotateSpeed = _get(props, 'rotateSpeed', 12) / 6;
  }

  const addModel = () => {
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

  const startAnimate = () => {
    if (umount.current) return;

    cameraControl.current.update();
    renderer.current.render(scene.current, camera.current);

    requestAnimationFrame(startAnimate);
  }

  const renderScene = () => {
    const $el = document.getElementById(id.current) as HTMLElement;

    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.setSize($el.offsetWidth, $el.offsetHeight);
    $el.appendChild(renderer.current.domElement);
  }

  useEffect(() => {
    renderScene();
    startAnimate();
    return () => {
      umount.current = true;
    }
  }, []);

  useEffect(() => {
    addModel();
  }, [model]);

  useEffect(() => {
    (lights || []).forEach(light => {
      if (scene.current.getObjectById(light.id)) {
        return;
      }
      scene.current.add(light);
    })
  }, [lights]);

  useEffect(() => {
    updateSize();
  }, [height, width]);

  return (
    <div id={id.current} style={{ height, width, ...style }} />
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