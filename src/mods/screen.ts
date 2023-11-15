import { Scope, modifyGetter } from '.';
import { Random } from '../utils/random';

export function modifyScreen (scope: Scope) {
  function randomizeValue ({originalValue, random}: {originalValue: number, random: Random}): number {
    return Math.round(originalValue * (1 + random.nextFloatBetween(-0.05, 0.05)));
  }

  modifyGetter(scope.Screen.prototype, 'width', randomizeValue);
  modifyGetter(scope.Screen.prototype, 'availWidth', randomizeValue);
  modifyGetter(scope.Screen.prototype, 'height', randomizeValue);
  modifyGetter(scope.Screen.prototype, 'availHeight', randomizeValue);

  // TODO(2023-11-10): availTop?

  // addPatch(scope.Screen.prototype, 'pixelDepth', () => 24);
  // addPatch(scope.Screen.prototype, 'colorDepth', () => 24);
}
