import { Scope, modifyFunctionReturnValue, modifyGetter, modifyValue } from '.';
import { Random } from '../utils/random';

export function modifyCanvas (scope: Scope) {
  function randomizeValue ({originalValue, random}: {originalValue: number, random: Random}): number {
    // TODO(2023-11-12): Mutate random by value?
    return originalValue * (1 + random.nextFloatBetween(-0.0005, 0.0005));
  }

  modifyGetter(scope.TextMetrics.prototype, 'actualBoundingBoxAscent', randomizeValue);
  modifyGetter(scope.TextMetrics.prototype, 'actualBoundingBoxDescent', randomizeValue);
  modifyGetter(scope.TextMetrics.prototype, 'actualBoundingBoxLeft', randomizeValue);
  modifyGetter(scope.TextMetrics.prototype, 'actualBoundingBoxRight', randomizeValue);
  modifyGetter(scope.TextMetrics.prototype, 'fontBoundingBoxAscent', randomizeValue);
  modifyGetter(scope.TextMetrics.prototype, 'fontBoundingBoxDescent', randomizeValue);
  modifyGetter(scope.TextMetrics.prototype, 'width', randomizeValue);

  modifyFunctionReturnValue(scope.CanvasRenderingContext2D.prototype, 'getImageData', ({ originalReturnValue, random }) => {
    const data = originalReturnValue.data;
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
