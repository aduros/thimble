import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';

describe('navigator.hardwareConcurrency', () => {
  testFingerprint({
    query: (scope) => scope.navigator.hardwareConcurrency,

    validate (hardwareConcurrency) {
      expect(hardwareConcurrency).to.be.greaterThanOrEqual(1);
    }
  });
})
