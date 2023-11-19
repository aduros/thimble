import { expect } from "@esm-bundle/chai";
import { describeFingerprint } from "../utils/describeFingerprint"

describeFingerprint('StorageManager.estimate', {
  query: (scope) => scope.navigator.storage?.estimate(),

  validate (estimate, originalEstimate) {
    if (estimate) {
      expect(estimate).to.not.deep.equal(originalEstimate);
      expect(estimate.usage).to.equal(0);
      expect(estimate.quota).to.equal(52371609271);
    }
  }
})

describeFingerprint('Navigator.webkitTemporaryStorage', {
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
