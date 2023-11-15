import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';
import { Scope } from '.';

function createTestCanvas (scope: Scope): HTMLCanvasElement {
  const canvas = scope.document.createElement('canvas')
  const ctx = canvas.getContext('2d')!;
  ctx.fillText('Hello world', 0, 0);
  return canvas;
}

describe('getImageData', () => {
  testFingerprint({
    query: (scope) => {
      const canvas = createTestCanvas(scope);
      return canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
    },
    validate (imageData, originalImageData) {
      expect(imageData.width).to.equal(originalImageData.width);
      expect(imageData.height).to.equal(originalImageData.height);
    }
  });
});

describe('toDataURL', () => {
  testFingerprint({
    query: (scope) => createTestCanvas(scope).toDataURL(),
    validate (dataUrl) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => { resolve() };
        image.onerror = reject;
        image.src = dataUrl;
      });
    }
  });
});
