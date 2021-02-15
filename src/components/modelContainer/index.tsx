import * as React from 'react';
import * as Three from 'three';
import SingleModelScene, { SingleModelSceneProps } from '../singleModelScene';
import { loadModel } from '../../common/loader';
import { setMaterial } from '../../common/helper3d';
import { Object3D, Mesh, Material } from 'three';

const { useState, useEffect } = React;

interface ModelContainerProps extends SingleModelSceneProps {
  modelUrl: string;
  resourcePath?: string;
  material?: Material;
  onLoad?: (model?: Object3D, meshes?: Mesh[]) => void;
  materials?: { [MeshUuid: string]: Material };
}

/**
 * 模型容器组件
 * 1. 加载网络模型
 * 2. 可以给模型贴图
 * 3. 支持拆解动画
 * 4. 支持模型xyz轴旋转
 */
export default function ModelContainer(props: ModelContainerProps) {
  const { modelUrl, resourcePath, material, onLoad, ...restProps } = props;

  const [model, setModel] = useState<Object3D>();
  const [meshes, setMeshes] = useState<Three.Mesh[]>();

  const getMeshs = (modelObj?: Object3D) => {
    const meshes: Mesh[] = [];
    modelObj?.traverse(child => {
      if (child instanceof Mesh) {
        meshes.push(child);
      }
    });
    setMeshes(meshes);
    return meshes;
  }

  const getModel = async () => {
    const modelObj = await loadModel(modelUrl, { resourcePath });
    const meshes = getMeshs(modelObj);
    setMaterial(modelObj, material);
    setModel(modelObj);

    onLoad && onLoad(modelObj, meshes);
  }

  useEffect(() => {
    getModel();
  }, [modelUrl]);

  useEffect(() => {
    setMaterial(model, material);
  }, [material]);

  useEffect(() => {
    setMaterial(model, material);
  }, [material]);


  return (
    <SingleModelScene {...restProps} model={model} />
  )
}