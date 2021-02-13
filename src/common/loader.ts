import * as Three from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { getFileType } from './utils';
import { MODEL_TYPES } from './constants'
import Logger from './logger';

const logger = new Logger({ prefix: '[model loader]' });

interface LoaderOptions {
  mtlUrl?: string;
  resourcePath?: string;
}

const setLoadersCors = (loaders: any[]) => {
  loaders.forEach(loader => {
    loader?.setCrossOrigin('Anonymous');
  });
}

export function loadFbx(url: string, opts?: LoaderOptions) {
  const loader = new FBXLoader();
  setLoadersCors([loader]);

  return new Promise<Three.Object3D>((resolve, reject) => {
    loader.load(url, obj => {
      resolve(obj)
    }, e => logger.debug('loading: ' + url), e => {
      logger.error(e);
      reject(e);
    })
  })
}

export function loadTds(url: string, opts?: LoaderOptions) {
  const loader = new TDSLoader();
  setLoadersCors([loader]);

  const { resourcePath = '' } = opts || {};
  loader.setResourcePath(resourcePath);

  return new Promise<Three.Object3D>((resolve, reject) => {
    loader.load(url, obj => {
      resolve(obj)
    }, e => logger.debug('loading: ' + url), e => {
      logger.error(e);
      reject(e);
    });
  });
}

export function loadGltf(url: string, opts?: LoaderOptions) {
  const loader = new GLTFLoader();
  setLoadersCors([loader]);

  return new Promise<Three.Object3D>((resolve, reject) => {
    loader.load(url, obj => {
      resolve(obj.scene)
    }, e => logger.debug('loading: ' + url), e => {
      logger.error(e);
      reject(e);
    })
  })
}

export function loadModel(url: string, opts?: LoaderOptions) {
  const loaderByFileType = {
    [MODEL_TYPES.fbx]: loadFbx,
    [MODEL_TYPES.tds]: loadTds,
    [MODEL_TYPES.glb]: loadGltf,
  }
  const type = getFileType(url);
  const fn = loaderByFileType[type];
  if (!fn) {
    logger.error('invalid file type: ' + type);
  }
  return fn(url, opts);
}
