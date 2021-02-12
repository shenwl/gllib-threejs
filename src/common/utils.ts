import * as THREE from 'three';

const { Clock } = THREE;

export const clock = new Clock();

export function getFileType(url: string) {
  const lastDot = url.lastIndexOf('.');
  try {
    const arr = url.slice(0, lastDot - 1).split('.');
    const suffix = arr[arr.length - 1];
    if (suffix.indexOf('?')) {
      return suffix.split('?')[0];
    }
    return suffix;
  } catch (e) {
    console.error(e);
    return '';
  };
}

export function assertUrlFileType(url: string, type: string | Array<string>): boolean {
  if (!url) return false;
  const fileType = getFileType(url);
  if (Array.isArray(type)) {
    return type.includes(fileType);
  }
  return type === fileType;
}