import { Scope } from ".";

const mimicFunctions = new WeakMap<Function,Function>();

export function createMimicFunction (originalFunction: (...args: any[]) => any, newFunction: (...args: any[]) => any) {
  const { mimic } = {
    mimic(...args: any[]) {
      return newFunction.call(this, ...args);
    }
  };
  Object.defineProperty(mimic, 'name', { value: originalFunction.name });
  Object.defineProperty(mimic, 'length', { value: originalFunction.length });
  mimicFunctions.set(mimic, originalFunction);
  return mimic;
}

export function modifyFunction (scope: Scope) {
  const originalToString = scope.Function.prototype.toString;
  const mimicToString = createMimicFunction(originalToString, function (this: Function) {
    if (mimicFunctions.get(this) != null) {
      console.log("has MaskedToString");
    }
    const self = mimicFunctions.get(this) ?? this;
    return originalToString.call(self);
  });
  scope.Function.prototype.toString = mimicToString;

  // TODO(2023-11-14): set scope.Function.prototype.valueOf?
}
