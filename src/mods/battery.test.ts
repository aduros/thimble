import { expect } from "@esm-bundle/chai";
import { testFingerprint } from "../utils/testFingerprint"

describe('battery', () => {
  testFingerprint({
    query: (scope) => scope.navigator.getBattery?.(),
    validate (battery) {
      if (battery) {
        expect(battery.charging).to.be.true;
        expect(battery.chargingTime).to.equal(0);
        expect(battery.dischargingTime).to.equal(Infinity);
        expect(battery.level).to.equal(1);
      }
    }
  })
})