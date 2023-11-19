import { expect } from '@esm-bundle/chai';
import { describeFingerprint } from '../utils/describeFingerprint';

describeFingerprint('Navigator.doNotTrack', {
  query: (scope) => scope.navigator.doNotTrack,

  validate (doNotTrack) {
    expect(doNotTrack).to.be.oneOf([null, '0', '1']);
  }
})
