import { Scope, modifyFunctionReturnValue } from ".";

export function modifyMedia (scope: Scope) {
  modifyFunctionReturnValue(scope.HTMLMediaElement.prototype, 'canPlayType', ({originalArgs, originalReturnValue, random}) => {
    // Randomly swap "probably" and "maybe"
    if (originalReturnValue && random.mutateByString(originalArgs[0]).nextBoolean()) {
      switch (originalReturnValue) {
        case 'probably': return 'maybe';
        case 'maybe': return 'probably';
        default: originalReturnValue satisfies never;
      }
    }
    return originalReturnValue;
  });
}
