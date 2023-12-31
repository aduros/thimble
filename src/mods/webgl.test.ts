import { expect } from '@esm-bundle/chai'
import { describeFingerprint } from '../utils/describeFingerprint'

describeFingerprint('WebGLRenderingContext.getParameter', {
  query(scope) {
    const canvas = scope.document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    if (!gl) {
      return undefined
    }

    const params = [
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
      // "MAX_ELEMENT_INDEX",
      // "MAX_CLIENT_WAIT_TIMEOUT_WEBGL",
    ] as const

    const result: Record<string, unknown> = {}
    for (const param of params) {
      result[param] = gl.getParameter(gl[param])
    }
    return result
  },

  validate(extensions, originalExtensions) {
    if (extensions) {
      expect(extensions).to.not.deep.equal(originalExtensions)
    }
  },
})

describeFingerprint('WEBGL_debug_renderer_info', {
  query(scope) {
    const canvas = scope.document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    if (!gl) {
      return undefined
    }

    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    return {
      extensionIsNull: ext === null,
      vendor: gl.getParameter(37445),
      renderer: gl.getParameter(37446),
    }
  },

  validate(info) {
    if (info) {
      expect(info.extensionIsNull).to.be.true
      expect(info.vendor).to.equal(null)
      expect(info.renderer).to.equal(null)
    }
  },
})
