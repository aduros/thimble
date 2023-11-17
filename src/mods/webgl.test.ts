import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';

describe('webgl', () => {
  testFingerprint({
    query (scope) {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2')!;

      const params: string[] = [
        'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
        'MAX_CUBE_MAP_TEXTURE_SIZE',
        'MAX_FRAGMENT_UNIFORM_VECTORS',
        'MAX_RENDERBUFFER_SIZE',
        'MAX_TEXTURE_IMAGE_UNITS',
        'MAX_TEXTURE_SIZE',
        'MAX_VARYING_VECTORS',
        'MAX_VERTEX_ATTRIBS',
        'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
        'MAX_VERTEX_UNIFORM_VECTORS',
        'MAX_VIEWPORT_DIMS',
        'MAX_ELEMENT_INDEX',
        'MAX_CLIENT_WAIT_TIMEOUT_WEBGL',
      ]

      const result: any = {};
      for (const param of params) {
        result[param] = gl.getParameter((gl as any)[param])
      }
      console.log(result);
      return result;
    },

    validate (extensions, originalExtensions) {
      expect(extensions).to.not.deep.equal(originalExtensions);
    },
  });
})
