import { expect } from '@esm-bundle/chai'
import { describeFingerprint } from '../utils/describeFingerprint'

describeFingerprint('Navigator.getBattery', {
  query: (scope) => scope.navigator.getBattery?.(),

  validate(battery) {
    if (battery) {
      // expect(battery.charging).to.be.false
      expect(battery.chargingTime).to.equal(0)
      expect(battery.dischargingTime).to.equal(Infinity)
      expect(battery.level).to.be.within(0.9, 1)
    }
  },
})
