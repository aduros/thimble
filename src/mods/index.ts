import { modifyCanvas } from "./canvas";
import { Random } from "../utils/random";
import { modifyHardwareConcurrency } from "./hardwareConcurrency";
import { modifyDeviceMemory } from "./deviceMemory";
import { modifyScreen } from "./screen";
import { modifyAudio } from "./audio";
import { modifyLanguage } from "./language";
import { modifyTimezone } from "./timezone";
import { modifyClientRects } from "./clientRects";
import { modifyMedia } from "./media";
import { modifyFrame } from "./frame";
import { createMimicFunction, modifyFunction } from "./function";
import { modifyWebGL } from "./webgl";
import { modifyDoNotTrack } from "./doNotTrack";
import { modifyBattery } from "./battery";
import { modifyStorage } from "./storage";

declare global {
  interface Window {
    __thimbleRootState?: RootState;
    __thimblePatched?: boolean;
  }
}

export interface RootState {
  seed: number
  nextModificationId: number
  mimicFunctions: WeakMap<Function, Function>
}

export function getRootState(): RootState {
  // let rootState = window.parent.__thimbleRootState ?? window.__thimbleRootState;
  let rootState = window.top?.__thimbleRootState ?? window.__thimbleRootState;
  if (!rootState) {
    rootState = window.__thimbleRootState = {
      seed: (Math.random() * 4294967295) >>> 0,
      nextModificationId: 0,
      mimicFunctions: new WeakMap(),
    };
  }
  return rootState;
}

export interface ModifyValueContext<Value> {
  originalValue: Value,
  random: Random,
}

export function modifyValue<Self, Prop extends keyof Self> (obj: Self, prop: Prop, getNewValue: (ctx: ModifyValueContext<Self[Prop]>) => Self[Prop]) {
  const rootState = getRootState();
  const modId = rootState.nextModificationId++;

  if (!obj) {
    return;
  }

  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (!descriptor) {
    throw new Error(`Missing descriptor: ${prop.toString()}`);
  }

  const ctx = {
    originalValue: descriptor.value,
    random: new Random(rootState.seed).mutateByUInt32(modId),
  }
  const newValue = getNewValue(ctx);
  Object.defineProperty(obj, prop, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: typeof newValue === 'function' ? createMimicFunction(rootState, descriptor.value, newValue as any) : newValue,
  });
}

export interface ModifyGetterContext<Self, Value> {
  self: Self,
  originalValue: Value,
  random: Random,
}

export function modifyGetter<Obj, Self extends NonNullable<Obj>, Prop extends keyof Self, Value extends Self[Prop]> (obj: Obj, prop: Prop, newGetter: (ctx: ModifyGetterContext<Self, Value>) => Value) {
  const rootState = getRootState();
  const modId = rootState.nextModificationId++;

  if (!obj) {
    return;
  }

  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (!descriptor) {
    throw new Error(`Missing descriptor: ${prop.toString()}`);
  }

  Object.defineProperty(obj, prop, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    set: descriptor.set,
    get: createMimicFunction(rootState, descriptor.get!, function (this: Self) {
      const originalValue = descriptor.get!.call(this);
      const ctx = {
        originalValue,
        random: new Random(rootState.seed).mutateByUInt32(modId),
        self: this,
      };
      return newGetter(ctx);
    })
  });
}

export interface ModifyFunctionReturnValueContext<Self, Fn extends (...args: any) => any> {
  self: Self,
  originalFunction: Fn,
  originalArgs: Parameters<Fn>,
  originalReturnValue: ReturnType<Fn>
  random: Random,
}

export function modifyFunctionReturnValue<Self, Prop extends keyof Self, Fn extends (Self[Prop] extends (...args: any[]) => any ? Self[Prop] : never)> (obj: Self, prop: Prop, filter: (ctx: ModifyFunctionReturnValueContext<Self, Fn>) => ReturnType<Fn>) {
  modifyValue(obj, prop, (ctx) => {
    return function (this: Self, ...originalArgs: any[]) {
      const originalFunction = ctx.originalValue;
      return filter({
        self: this,
        originalFunction: originalFunction as any,
        originalArgs: originalArgs as any,
        originalReturnValue: (ctx.originalValue as (...args: any[]) => any).call(this, ...originalArgs),
        random: ctx.random.clone(),
      });
    } as Self[Prop];
  });
}

export type Scope = Window & typeof globalThis;

export function modifyAll (scope: Scope) {
  // TODO(2023-11-14): Make this undetectable?
  try {
    if (scope.__thimblePatched) {
      return;
    }
    scope.__thimblePatched = true;
  } catch (error) {
    console.log('Error modifying frame, could be cross-origin?', error);
    return;
  }

  console.log('Applying patches to scope');
  getRootState().nextModificationId = 0;

  modifyFunction(scope);
  modifyFrame(scope);

  // modifyTimezone(scope);
  modifyAudio(scope);
  modifyBattery(scope);
  modifyCanvas(scope);
  modifyClientRects(scope);
  modifyDeviceMemory(scope);
  modifyDoNotTrack(scope);
  modifyHardwareConcurrency(scope);
  modifyLanguage(scope);
  modifyMedia(scope);
  modifyScreen(scope);
  modifyStorage(scope);
  modifyWebGL(scope);

  // Object.defineProperty(scope.TypeError.prototype, 'stack', {
  //   get: () => {
  //     return 'zz'
  //   }
  // });
  //
  // modifyGetter(Error.prototype, 'stack', () => {
  // })
}
