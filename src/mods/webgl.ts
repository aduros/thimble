import { Modifier } from "../install";

export function modifyWebGL ({ scope, modifyReturned }: Modifier) {
  for (const type of [ scope.WebGLRenderingContext, scope.WebGL2RenderingContext ]) {
    modifyReturned(type.prototype, 'getParameter', ({ originalReturned, originalArgs, random }) => {
      if (originalReturned) {
        const paramId = originalArgs[0];
        switch (paramId) {
          case 35661: // MAX_COMBINED_TEXTURE_IMAGE_UNITS
          case 34076: // MAX_CUBE_MAP_TEXTURE_SIZE
          case 36349: // MAX_FRAGMENT_UNIFORM_VECTORS
          case 34024: // MAX_RENDERBUFFER_SIZE
          case 34930: // MAX_TEXTURE_IMAGE_UNITS
          case 3379: // MAX_TEXTURE_SIZE
          case 36348: // MAX_VARYING_VECTORS
          case 34921: // MAX_VERTEX_ATTRIBS
          case 35660: // MAX_VERTEX_TEXTURE_IMAGE_UNITS
          case 36347: // MAX_VERTEX_UNIFORM_VECTORS 
            return Math.max(0, originalReturned - random.mutateByUInt32(paramId).nextIntBetween(0, 4));

          case 37445: // UNMASKED_VENDOR_WEBGL
          case 37446: // UNMASKED_RENDERER_WEBGL
            return null;
        }
      }
      return originalReturned;
    });

    modifyReturned(type.prototype, 'getExtension', ({ originalReturned, originalArgs }) => {
      if (originalArgs[0] === 'WEBGL_debug_renderer_info') {
        return null;
      }
      return originalReturned;
    });
  }
}
