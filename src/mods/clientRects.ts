import { Scope, modifyFunctionReturnValue, modifyGetter, modifyValue } from '.';
import { Random } from '../utils/random';

export function modifyClientRects (scope: Scope) {
  function randomizeValue ({originalValue, random}: {originalValue: number, random: Random}): number {
    // TODO(2023-11-12): Mutate random by value?
    return originalValue * (1 + random.nextFloatBetween(-0.0005, 0.0005));
  }

  modifyGetter(scope.HTMLElement.prototype, 'offsetWidth', randomizeValue);
  modifyGetter(scope.HTMLElement.prototype, 'offsetHeight', randomizeValue);

  modifyGetter(scope.DOMRect.prototype, 'x', randomizeValue);
  modifyGetter(scope.DOMRect.prototype, 'y', randomizeValue);
  modifyGetter(scope.DOMRect.prototype, 'width', randomizeValue);
  modifyGetter(scope.DOMRect.prototype, 'height', randomizeValue);

  // DOMRect.toJSON() leaks original values, patch it
  modifyFunctionReturnValue(scope.DOMRectReadOnly.prototype, 'toJSON', ({originalReturnValue, self}) => {
    for (const prop in originalReturnValue) {
      originalReturnValue[prop] = self[prop as keyof DOMRectReadOnly];
    }
    return originalReturnValue;
  });

  modifyGetter(scope.SVGRect.prototype, 'x', randomizeValue);
  modifyGetter(scope.SVGRect.prototype, 'y', randomizeValue);
  modifyGetter(scope.SVGRect.prototype, 'width', randomizeValue);
  modifyGetter(scope.SVGRect.prototype, 'height', randomizeValue);
}
