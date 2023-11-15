import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';
import { Scope } from '.';

function createTestSpan(scope: Scope): HTMLSpanElement {
  const span = scope.document.createElement('span');
  span.textContent = 'Hello world';
  span.style.position = 'absolute';
  scope.document.body.appendChild(span);
  return span;
}

describe('offsetWidth/Height', () => {
  testFingerprint({
    query: (scope) => {
      const span = createTestSpan(scope);
      return [span.offsetWidth, span.offsetHeight];
    },
    validate ([offsetWidth, offsetHeight]) {
      expect(offsetWidth).to.be.greaterThan(0);
      expect(offsetHeight).to.be.greaterThan(0);
    }
  });
});

describe('getBoundingClientRect', () => {
  testFingerprint({
    query: (scope) => {
      const span = createTestSpan(scope);
      const rect = span.getBoundingClientRect();
      return [rect.x, rect.y, rect.width, rect.height];
    },
    validate ([x, y, width, height]) {
      expect(width).to.be.greaterThan(0);
      expect(height).to.be.greaterThan(0);
    }
  });
});

describe('getClientRects', () => {
  testFingerprint({
    query: (scope) => {
      const span = createTestSpan(scope);
      const rects = span.getClientRects();
      return Array.from(rects, rect => ([rect.x, rect.y, rect.width, rect.height]));
    },
    validate (rects) {
      for (const rect of rects) {
        const [x, y, width, height] = rect;
        expect(width).to.be.greaterThan(0);
        expect(height).to.be.greaterThan(0);
      }
    }
  });
});
