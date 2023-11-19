import { expect } from '@esm-bundle/chai'
import { describeFingerprint } from '../utils/describeFingerprint'

describeFingerprint('Navigator.hardwareConcurrency', {
  query: (scope) => scope.navigator.hardwareConcurrency,

  validate(hardwareConcurrency) {
    expect(hardwareConcurrency).to.be.greaterThanOrEqual(1)
  },
})
