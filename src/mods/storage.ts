import { Modifier } from "../install";

declare global {
  interface DeprecatedStorageQuota {
    queryUsageAndQuota(onResult: (usage: number, quota: number) => void, onError: () => void): void;
  }

  interface Navigator {
    webkitTemporaryStorage: DeprecatedStorageQuota;
  }
}

export function modifyStorage ({ scope, modifyReturned, modifyValue }: Modifier) {
  modifyReturned(scope.StorageManager?.prototype, 'estimate', async ({ originalReturned, random }) => {
    // Await the original value to prevent a timing attack
    const estimate = await originalReturned;

    // Random number of bytes between 2 and 32 GB. Use nextFloat() here to avoid overflow.
    estimate.quota = 2*1024*1024*1024 + Math.floor(random.nextFloat()*30*1024*1024*1024);

    estimate.usage = 0;
    (estimate as any).usageDetails = {};

    return estimate;
  });

  // Chrome-only
  if ('webkitTemporaryStorage' in scope.navigator) {
    const webkitTemporaryStorageProto = Object.getPrototypeOf(scope.navigator.webkitTemporaryStorage);
    modifyValue(webkitTemporaryStorageProto, 'queryUsageAndQuota', () => {
      return function (this: DeprecatedStorageQuota, onResult: (usage: number, quota: number) => void, onError?: () => void) {
        scope.StorageManager.prototype.estimate.call(scope.navigator.storage).then((estimate) => {
          onResult(estimate.usage ?? 0, estimate.quota ?? 0);
        }, onError);
      }
    });
  }
}
