import { RootState, Scope, getRootState } from ".";

export function createMimicFunction (rootState: RootState, originalFunction: (...args: any[]) => any, newFunction: (...args: any[]) => any) {
  const { mimic } = {
    mimic(...args: any[]) {
      return newFunction.call(this, ...args);
    }
  };
  Object.defineProperty(mimic, 'name', { value: originalFunction.name });
  Object.defineProperty(mimic, 'length', { value: originalFunction.length });
  rootState.mimicFunctions.set(mimic, originalFunction);
  return mimic;
}

export function modifyFunction (scope: Scope) {
  const rootState = getRootState();

  const originalToString = scope.Function.prototype.toString;
  const mimicToString = createMimicFunction(rootState, originalToString, function (this: Function) {
    const self = rootState.mimicFunctions.get(this) ?? this;
    return originalToString.call(self);
  });
  scope.Function.prototype.toString = mimicToString;

  // TODO(2023-11-14): set scope.Function.prototype.valueOf?
}
