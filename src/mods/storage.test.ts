import { expect } from "@esm-bundle/chai";
import { testFingerprint } from "../utils/testFingerprint"

describe('navigator.storage.estimate', () => {
  testFingerprint({
    query: (scope) => scope.navigator.storage.estimate(),
    validate (estimate, originalEstimate) {
      expect(estimate).to.not.deep.equal(originalEstimate);
      expect(estimate.usage).to.equal(0);
      expect(estimate.quota).to.equal(51144149);
    }
  })
})

describe('navigator.webkitTemporaryStorage', () => {
  testFingerprint({
    query (scope) {
      return new Promise<{ usage: number, quota: number }>((resolve, reject) => {
        scope.navigator.webkitTemporaryStorage.queryUsageAndQuota((usage, quota) => {
          resolve({ usage, quota });
        }, reject);
      })
    },
    validate (estimate, originalEstimate) {
      expect(estimate).to.not.deep.equal(originalEstimate);
      expect(estimate.usage).to.equal(0);
      expect(estimate.quota).to.equal(51144149);
    }
  })
})
