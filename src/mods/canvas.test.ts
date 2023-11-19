import { expect } from '@esm-bundle/chai';
import { describeFingerprint } from '../utils/describeFingerprint';
import { Scope } from '../install';

function createTestCanvas (scope: Scope): HTMLCanvasElement {
  const canvas = scope.document.createElement('canvas')
  canvas.width = 220;
  canvas.height = 30;

  const ctx = canvas.getContext('2d')!;
  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText('Hello world', 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText('Hello world', 4, 17);
  return canvas;
}

describeFingerprint('HTMLCanvasElement.toDataURL', {
  query: (scope) => createTestCanvas(scope).toDataURL(),

  async validate (dataUrl, originalDataUrl) {
    expect(dataUrl).to.not.equal(originalDataUrl);
    await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = dataUrl;
    });
  }
});

describeFingerprint('CanvasRenderingContext2D.getImageData', {
  query: (scope) => {
    const canvas = createTestCanvas(scope);
    return canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
  },
  validate (imageData, originalImageData) {
    expect(imageData.width).to.equal(originalImageData.width);
    expect(imageData.height).to.equal(originalImageData.height);
    expect(imageData.data).to.not.deep.equal(originalImageData.data);
  }
});

describeFingerprint('CanvasRenderingContext2D.measureText', {
  query: (scope) => scope.document.createElement('canvas').getContext('2d')!.measureText('Hello world'),

  async validate (metrics, originalMetrics) {
    expect(metrics).to.not.deep.equal(originalMetrics);

    // The individual properties must also differ
    for (const prop in metrics) {
      const originalValue = originalMetrics[prop as keyof TextMetrics];
      if (originalValue !== 0) {
        expect(metrics).to.not.have.property(prop, originalValue);
      }
    }
  }
});
