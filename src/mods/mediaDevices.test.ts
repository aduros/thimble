import { expect } from '@esm-bundle/chai'
import { describeFingerprint } from '../utils/describeFingerprint'

describeFingerprint('MediaDevice.enumerateDevices', {
  query: (scope) => scope.navigator.mediaDevices.enumerateDevices(),

  validate(devices, originalDevices) {
    console.log(devices, originalDevices)
    expect(devices.length).to.equal(originalDevices.length)
  },
})
