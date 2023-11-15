import { Scope, modifyGetter } from '.';

declare global {
  interface Navigator {
    deviceMemory?: number;
  }

  interface MemoryInfo {
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  }
  var MemoryInfo: {
      prototype: MemoryInfo;
      new(): MemoryInfo;
  };
}

export function modifyDeviceMemory (scope: Scope) {
  modifyGetter(scope.Navigator.prototype, 'deviceMemory', ({originalValue, random}) => {
    if (typeof originalValue === 'number') {
      return 2 ** random.nextIntBetween(0, 3);
    } else {
      return originalValue;
    }
  });

  // modifyGetter((scope.performance as any).memory, 'totalJSHeapSize', () => 0);
  // modifyGetter((scope.performance as any).memory, 'usedJSHeapSize', () => 0);
  // modifyGetter((scope.performance as any).memory, 'jsHeapSizeLimit', () => 0);

  modifyGetter((scope.Performance.prototype as any), 'memory', () => undefined);
}
