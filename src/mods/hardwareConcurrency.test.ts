import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';

describe('navigator.hardwareConcurrency', () => {
  testFingerprint({
    query: (scope) => scope.navigator.hardwareConcurrency,
    expectDifferences: false,
    validate (hardwareConcurrency) {
      expect(hardwareConcurrency).to.be.greaterThanOrEqual(1);
    }
  });
})
