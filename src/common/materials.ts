import * as Three from 'three';
import _uniqueId from 'lodash/uniqueId';

export const createMaterial = (type: MaterialType, opts: any) => {
  return new Three[type]({
    name: _uniqueId('material'),
    ...opts,
    color: opts.color || 0x222222,
  });
}