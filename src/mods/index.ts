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

interface RootState {
  seed: number
  nextModificationId: number
  // mimicFunctions: WeakMap<Function, Function>
}

export function getRootState(scope: Scope): RootState {
  // let rootState = window.top?.__thimbleRootState ?? window.__thimbleRootState;
  // if (!rootState) {
  //   rootState = window.__thimbleRootState = {
  //     seed: (Math.random() * 4294967295) >>> 0,
  //     nextModificationId: 0,
  //   };
  // }
  // return rootState;

  let rootState = window.parent.__thimbleRootState ?? window.__thimbleRootState;
  if (!rootState) {
    rootState = window.__thimbleRootState = {
      seed: (Math.random() * 4294967295) >>> 0,
      nextModificationId: 0,
    };
  }
  return rootState;

  // let state = scope.parent.__thimbleRootState
  // if (!state) {
  //   state = scope.__thimbleRootState;
  //   if (!state) {
  //     console.log('Creating');
  //     // Should never happen?
  //     state = scope.__thimbleRootState = {
  //       seed: Date.now(),
  //       nextModificationId: 0,
  //     }
  //   }
  // }
  // return state;

  // let state = scope.parent.__thimbleRootState
  // if (!state) {
  //   state = scope.__thimbleRootState;
  //   if (!state) {
  //     console.log('Creating');
  //     state = scope.__thimbleRootState = {
  //       seed: Date.now(),
  //       nextModificationId: 0,
  //     }
  //   }
  // }
  // return state;
}

export interface ModifyValueContext<T> {
  originalValue: T,
  random: Random,
}

export function modifyValue<O, Prop extends keyof O> (obj: O, prop: Prop, getNewValue: (ctx: ModifyValueContext<O[Prop]>) => O[Prop]) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (!descriptor) {
    throw new Error(`Missing descriptor: ${prop.toString()}`);
  }

  const rootState = getRootState();
  const modId = rootState.nextModificationId++;
  const ctx = {
    originalValue: descriptor.value,
    random: new Random(rootState.seed).mutateByUInt32(modId),
  }
  const newValue = getNewValue(ctx);
  Object.defineProperty(obj, prop, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: typeof newValue === 'function' ? createMimicFunction(descriptor.value, newValue as any) : newValue,
  });
}

export interface ModifyGetterContext<Self, T> {
  self: Self,
  originalValue: T,
  random: Random,
}

export function modifyGetter<O, Prop extends keyof O> (obj: O, prop: Prop, newGetter: (ctx: ModifyGetterContext<O, O[Prop]>) => O[Prop]) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (!descriptor) {
    throw new Error(`Missing descriptor: ${prop.toString()}`);
  }

  const rootState = getRootState();
  const modId = rootState.nextModificationId++;
  Object.defineProperty(obj, prop, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    set: descriptor.set,
    get: createMimicFunction(descriptor.get!, function (this: O) {
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

export function modifyFunctionReturnValue<O, Prop extends keyof O, Fn extends (O[Prop] extends (...args: any[]) => any ? O[Prop] : never)> (obj: O, prop: Prop, filter: (ctx: ModifyFunctionReturnValueContext<O, Fn>) => ReturnType<Fn>) {
  modifyValue(obj, prop, (ctx) => {
    return function (this: O, ...originalArgs: any[]) {
      const originalFunction = ctx.originalValue;
      return filter({
        self: this,
        originalFunction: originalFunction as any,
        originalArgs: originalArgs as any,
        originalReturnValue: (ctx.originalValue as (...args: any[]) => any).call(this, ...originalArgs),
        random: ctx.random.clone(),
      });
    } as O[Prop];
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
  getRootState(scope).nextModificationId = 0;

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
}
