import { Scope, modifyFunctionReturnValue } from ".";

export function modifyMedia (scope: Scope) {
  modifyFunctionReturnValue(scope.HTMLMediaElement.prototype, 'canPlayType', ({originalArgs, originalReturnValue, random}) => {
    console.log('canPlayType', originalArgs, originalReturnValue);
    // TODO(2023-11-14): Don't use Math.random
    if (originalReturnValue === 'probably' && Math.random() > 0.5) {
      return 'maybe';
    }
    return originalReturnValue;
  });
}
