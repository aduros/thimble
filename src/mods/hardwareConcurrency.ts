import { Scope, modifyGetter } from '.';

export function modifyHardwareConcurrency (scope: Scope) {
  modifyGetter(scope.Navigator.prototype, 'hardwareConcurrency', ({ originalValue, random }) => {
    return Math.max(1, originalValue + random.nextIntBetween(-2, 2));
  });
}
