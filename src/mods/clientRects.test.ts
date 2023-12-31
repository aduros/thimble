import { expect } from '@esm-bundle/chai'
import { describeFingerprint } from '../utils/describeFingerprint'
import { Scope } from '../install'

function createTestSpan(scope: Scope): HTMLSpanElement {
  const span = scope.document.createElement('span')
  span.textContent = 'Hello world'
  span.style.position = 'absolute'
  scope.document.body.appendChild(span)
  return span
}

describeFingerprint('HTMLElement.offsetWidth/Height', {
  query: (scope) => {
    const span = createTestSpan(scope)
    return [span.offsetWidth, span.offsetHeight]
  },

  validate([width, height], [originalWidth, originalHeight]) {
    expect(width).to.be.greaterThan(0)
    expect(height).to.be.greaterThan(0)

    expect(width).to.not.equal(originalWidth)
    expect(height).to.not.equal(originalHeight)

    // Aspect ratio should also change
    expect(width / height).to.not.equal(originalWidth / originalHeight)
  },
})

describeFingerprint('Element.getBoundingClientRect', {
  query: (scope) => {
    return createTestSpan(scope).getBoundingClientRect()
  },

  validate(rect, originalRect) {
    expect(rect.width).to.be.greaterThan(0)
    expect(rect.height).to.be.greaterThan(0)

    expect(rect.width).to.not.equal(originalRect.width)
    expect(rect.height).to.not.equal(originalRect.height)

    // Aspect ratio should also change
    expect(rect.width / rect.height).to.not.equal(
      originalRect.width / originalRect.height,
    )
  },
})

describeFingerprint('Element.getClientRects', {
  query: (scope) => {
    return createTestSpan(scope).getClientRects()
  },

  validate(rects, originalRects) {
    expect(rects.length).to.equal(originalRects.length)

    for (let ii = 0; ii < rects.length; ++ii) {
      const [rect, originalRect] = [rects[ii], originalRects[ii]]

      expect(rect.width).to.be.greaterThan(0)
      expect(rect.height).to.be.greaterThan(0)

      expect(rect.width).to.not.equal(originalRect.width)
      expect(rect.height).to.not.equal(originalRect.height)

      // Aspect ratio should also change
      expect(rect.width / rect.height).to.not.equal(
        originalRect.width / originalRect.height,
      )
    }
  },
})

// TODO(2023-11-19): Add SVG tests
