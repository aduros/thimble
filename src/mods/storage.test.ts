import { expect } from "@esm-bundle/chai";
import { testFingerprint } from "../utils/testFingerprint"

describe('navigator.storage.estimate', () => {
  testFingerprint({
    query: (scope) => scope.navigator.storage.estimate(),
    validate (estimate, originalEstimate) {
      expect(estimate).to.not.deep.equal(originalEstimate);
      expect(estimate.usage).to.equal(0);
      expect(estimate.quota).to.equal(52371609271);
    }
  })
})

describe('navigator.webkitTemporaryStorage', () => {
  testFingerprint({
    query (scope) {
      return new Promise<{ usage: number, quota: number } | undefined>((resolve, reject) => {
        if (scope.navigator.webkitTemporaryStorage) {
          scope.navigator.webkitTemporaryStorage.queryUsageAndQuota((usage, quota) => {
            resolve({ usage, quota });
          }, reject);
        } else {
          resolve(undefined);
        }
      })
    },
    validate (estimate, originalEstimate) {
      if (estimate) {
        expect(estimate).to.not.deep.equal(originalEstimate);
        expect(estimate.usage).to.equal(0);
        expect(estimate.quota).to.equal(52371609271);
      }
    }
  })
})
