import { Scope, modifyFunctionReturnValue, modifyGetter, modifyValue } from '.';
import { Random } from '../utils/random';

export function modifyCanvas (scope: Scope) {
  function randomizeValue ({originalValue, random}: {originalValue: number, random: Random}): number {
    return originalValue * (1 + random.mutateByFloat(originalValue).nextFloatBetween(-0.0005, 0.0005));
  }

  // Since TextMetrics is still evolving, just modify all getters instead of specifying them individually
  const textMetricsDescriptors = Object.getOwnPropertyDescriptors(scope.TextMetrics.prototype);
  for (const [prop, descriptor] of Object.entries(textMetricsDescriptors)) {
    if (descriptor.get) {
      modifyGetter(scope.TextMetrics.prototype, prop as keyof TextMetrics, randomizeValue);
    }
  }

  modifyFunctionReturnValue(scope.CanvasRenderingContext2D.prototype, 'getImageData', ({ originalReturnValue, random }) => {
    const data = originalReturnValue.data;

    // Mutate the RNG to prevent attackers from undoing the noise by using a known preset
    random.mutateByBytes(data);

    for (let n = 0; n < data.length; ++n) {
      data[n] ^= random.nextInt() & 1;
    }
    return originalReturnValue;
  });

  function createNoisedCopy (sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
    const copyCanvas = scope.document.createElement('canvas');
    copyCanvas.width = sourceCanvas.width;
    copyCanvas.height = sourceCanvas.height;

    const copyCtx = copyCanvas.getContext('2d', { willReadFrequently: true })!;
    copyCtx.globalCompositeOperation = 'copy';
    copyCtx.drawImage(sourceCanvas, 0, 0);

    const imageData = copyCtx.getImageData(0, 0, copyCanvas.width, copyCanvas.height);
    copyCtx.putImageData(imageData, 0, 0);

    return copyCanvas;
  }

  modifyValue(scope.HTMLCanvasElement.prototype, 'toDataURL', ({ originalValue }) => {
    return function (this: HTMLCanvasElement, ...args) {
      return originalValue.call(createNoisedCopy(this), ...args);
    }
  });

  modifyValue(scope.HTMLCanvasElement.prototype, 'toBlob', ({ originalValue }) => {
    return function (this: HTMLCanvasElement, ...args) {
      return originalValue.call(createNoisedCopy(this), ...args);
    }
  });
}
