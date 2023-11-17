import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';

describe('getParameter', () => {
  testFingerprint({
    query (scope) {
      const canvas = scope.document.createElement('canvas');
      const gl = canvas.getContext('webgl')!;

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
      return result;
    },

    validate (extensions, originalExtensions) {
      expect(extensions).to.not.deep.equal(originalExtensions);
    },
  });
});

describe('WEBGL_debug_renderer_info', () => {
  testFingerprint({
    query (scope) {
      const canvas = scope.document.createElement('canvas');
      const gl = canvas.getContext('webgl')!;

      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        extensionIsNull: ext === null,
        vendor: gl.getParameter(37445),
        renderer: gl.getParameter(37446),
      }
    },

    validate (info) {
      expect(info.extensionIsNull).to.be.true;
      expect(info.vendor).to.equal(null);
      expect(info.renderer).to.equal(null);
    },
  });
})
