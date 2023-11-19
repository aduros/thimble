import { Modifier } from '../install';
import { Random } from '../utils/random';

export function modifyClientRects ({ scope, modifyReturned, modifyGetter }: Modifier) {
  function randomizeValue ({originalValue, random}: {originalValue: number, random: Random}): number {
    return originalValue * (1 + random.mutateByFloat(originalValue).nextFloatBetween(-0.0005, 0.0005));
  }

  modifyGetter(scope.HTMLElement.prototype, 'offsetWidth', randomizeValue);
  modifyGetter(scope.HTMLElement.prototype, 'offsetHeight', randomizeValue);

  modifyGetter(scope.DOMRect.prototype, 'x', randomizeValue);
  modifyGetter(scope.DOMRect.prototype, 'y', randomizeValue);
  modifyGetter(scope.DOMRect.prototype, 'width', randomizeValue);
  modifyGetter(scope.DOMRect.prototype, 'height', randomizeValue);

  // DOMRect.toJSON() leaks original values, patch it
  modifyReturned(scope.DOMRectReadOnly.prototype, 'toJSON', ({originalReturned, self}) => {
    for (const prop in originalReturned) {
      originalReturned[prop] = self[prop as keyof DOMRectReadOnly];
    }
    return originalReturned;
  });

  modifyGetter(scope.SVGRect.prototype, 'x', randomizeValue);
  modifyGetter(scope.SVGRect.prototype, 'y', randomizeValue);
  modifyGetter(scope.SVGRect.prototype, 'width', randomizeValue);
  modifyGetter(scope.SVGRect.prototype, 'height', randomizeValue);
}
