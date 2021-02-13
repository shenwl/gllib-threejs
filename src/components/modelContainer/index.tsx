import * as React from 'react';
import * as Three from 'three';
import SingleModelScene, { SingleModelSceneProps } from '../singleModelScene';
import { loadModel } from '../../common/loader';
import { setMaterial, setModelInCenter } from '../../common/helper3d';

const { useState, useEffect } = React;

interface ModelContainerProps extends SingleModelSceneProps {
  modelUrl: string;
  resourcePath?: string;
  material?: Three.Material;
}

/**
 * 模型容器组件
 * 1. 加载网络模型
 * 2. 可以给模型贴图
 * 3. 支持拆解动画
 * 4. 支持模型xyz轴偏移
 */
export default function ModelContainer(props: ModelContainerProps) {
  const { modelUrl, resourcePath, material, ...restProps } = props;

  const [model, setModel] = useState<Three.Object3D>();

  const getModel = async () => {
    const modelObj = await loadModel(modelUrl, { resourcePath });
    setMaterial(modelObj, material);
    setModelInCenter(modelObj);
    setModel(modelObj);
  }

  useEffect(() => {
    getModel();
  }, [modelUrl]);

  useEffect(() => {
    setMaterial(model, material);
  }, [material]);


  return (
    <SingleModelScene {...restProps} model={model} />
  )
}