import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';

describe('navigator.doNotTrack', () => {
  testFingerprint({
    query: (scope) => scope.navigator.doNotTrack,

    validate (doNotTrack) {
      expect(doNotTrack).to.be.oneOf([null, '0', '1']);
    }
  });
})
