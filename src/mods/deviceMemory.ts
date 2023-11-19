import { Modifier } from '../install';

export function modifyDeviceMemory ({ scope, modifyGetter }: Modifier) {
  // Chrome only
  if ('deviceMemory' in scope.Navigator.prototype) {
    modifyGetter(scope.Navigator.prototype, 'deviceMemory', ({originalValue, random}) => {
      if (typeof originalValue === 'number') {
        return 2 ** random.nextIntBetween(0, 3);
      } else {
        return originalValue;
      }
    });
  }

  // Chrome only
  if ('memory' in scope.Performance.prototype) {
    modifyGetter(scope.Performance.prototype, 'memory', () => undefined);
  }
}
