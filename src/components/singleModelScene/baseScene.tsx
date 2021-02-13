import * as React from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import _uniqueId from 'lodash/uniqueId';

type SceneProps = {
  style: React.CSSProperties;
  renderer: Three.WebGLRenderer;
  camera: Three.Camera;
  scene: Three.Scene;
  cameraControl?: OrbitControls;
}

/**
 * 基础场景
 * 负责Scene dom的创建，动画的播放，刷新
 */
export default class BaseScene extends React.Component<SceneProps> {
  id = _uniqueId('model-scene');
  umount = false;

  componentDidMount() {
    this.renderScene();
    this.animate();
  }

  componentWillUnmount() {
    this.umount = true;
  }

  animate = () => {
    if (this.umount) return;
    const { cameraControl, renderer, scene, camera } = this.props;

    cameraControl?.update();

    renderer.render(scene, camera);

    requestAnimationFrame(this.animate);
  }

  renderScene = () => {
    const { renderer } = this.props;

    const $el = document.getElementById(this.id) as HTMLElement;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize($el.offsetWidth, $el.offsetHeight);
    $el.appendChild(renderer.domElement);
  }

  render() {
    return (
      <div id={this.id} style={this.props.style} />
    )
  }
}