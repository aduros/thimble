import { expect } from '@esm-bundle/chai'
import { describeFingerprint } from '../utils/describeFingerprint'

if (typeof StorageManager !== 'undefined') {
  describeFingerprint('StorageManager.estimate', {
    query: (scope) => scope.navigator.storage.estimate(),

    validate(estimate, originalEstimate) {
      expect(estimate).to.not.deep.equal(originalEstimate)
      expect(estimate.usage).to.equal(0)
      expect(estimate.quota).to.be.within(2 * 1024 ** 3, 32 * 1024 ** 3)
    },
  })
}

if (navigator.webkitTemporaryStorage) {
  describeFingerprint('Navigator.webkitTemporaryStorage', {
    query(scope) {
      return new Promise<{ usage: number; quota: number }>(
        (resolve, reject) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          scope.navigator.webkitTemporaryStorage!.queryUsageAndQuota(
            (usage, quota) => {
              resolve({ usage, quota })
            },
            reject,
          )
        },
      )
    },

    validate(estimate, originalEstimate) {
      expect(estimate).to.not.deep.equal(originalEstimate)
      expect(estimate.usage).to.equal(0)
      expect(estimate.quota).to.be.within(2 * 1024 ** 3, 32 * 1024 ** 3)
    },
  })
}
