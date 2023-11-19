import { Modifier } from '../install';

export function modifyHardwareConcurrency ({ scope, modifyGetter }: Modifier) {
  modifyGetter(scope.Navigator.prototype, 'hardwareConcurrency', ({ originalValue, random }) => {
    return Math.max(1, originalValue + random.nextIntBetween(-2, 2));
  });
}
