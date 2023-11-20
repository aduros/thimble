import { expect } from '@esm-bundle/chai'
import { describeFingerprint } from '../utils/describeFingerprint'

describeFingerprint('Screen size', {
  query: (scope) => scope.screen,

  validate(screen, originalScreen) {
    expect(screen.width).to.be.greaterThanOrEqual(originalScreen.width)
    expect(screen.height).to.be.greaterThanOrEqual(originalScreen.height)

    expect(screen.width).to.equal(screen.availLeft + screen.availWidth)
    expect(screen.height).to.equal(screen.availTop + screen.availHeight)
  },
})

describeFingerprint('Screen position', {
  query: (scope) => ({
    x: scope.screenX,
    y: scope.screenY,
    left: scope.screenLeft,
    top: scope.screenTop,
  }),

  validate(pos, originalPos) {
    expect(pos.x).to.be.greaterThanOrEqual(originalPos.x)
    expect(pos.y).to.be.greaterThanOrEqual(originalPos.y)
    expect(pos.left).to.equal(pos.x)
    expect(pos.top).to.equal(pos.y)
  },
})

describeFingerprint('Window.devicePixelRatio', {
  query: (scope) => scope.devicePixelRatio,

  validate(devicePixelRatio, originalDevicePixelRatio) {
    expect(devicePixelRatio).to.be.greaterThan(originalDevicePixelRatio)
  },
})
