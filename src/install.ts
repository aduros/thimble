/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { modifyCanvas } from './mods/canvas'
import { Random } from './utils/random'
import { modifyHardwareConcurrency } from './mods/hardwareConcurrency'
import { modifyDeviceMemory } from './mods/deviceMemory'
import { modifyScreen } from './mods/screen'
import { modifyAudio } from './mods/audio'
import { modifyLanguage } from './mods/language'
import { modifyClientRects } from './mods/clientRects'
import { modifyMedia } from './mods/media'
import { modifyFrame } from './mods/frame'
import { modifyWebGL } from './mods/webgl'
import { modifyDoNotTrack } from './mods/doNotTrack'
import { modifyBattery } from './mods/battery'
import { modifyStorage } from './mods/storage'

const enabledMods = [
  modifyFrame,
  modifyAudio,
  modifyBattery,
  modifyCanvas,
  modifyClientRects,
  modifyDeviceMemory,
  modifyDoNotTrack,
  modifyHardwareConcurrency,
  modifyLanguage,
  modifyMedia,
  modifyScreen,
  modifyStorage,
  modifyWebGL,
]

export type Scope = Window & typeof globalThis

export interface Modifier {
  scope: Scope

  modifyValue<Self, Prop extends keyof Self>(
    obj: Self,
    prop: Prop,
    getNewValue: (api: ModifyValueAPI<Self[Prop]>) => Self[Prop],
  ): void

  modifyReturned<
    Self,
    Prop extends keyof Self,
    Fn extends Self[Prop] extends (...args: any[]) => any ? Self[Prop] : never,
  >(
    obj: Self,
    prop: Prop,
    filter: (api: ModifyReturnedAPI<Self, Fn>) => ReturnType<Fn>,
  ): void

  modifyGetter<
    Obj,
    Self extends NonNullable<Obj>,
    Prop extends keyof Self,
    Value extends Self[Prop],
  >(
    obj: Obj,
    prop: Prop,
    newGetter: (api: ModifyGetterAPI<Self, Value>) => Value,
  ): void
}

export interface ModifyValueAPI<Value> {
  originalValue: Value
  random: Random
}

export interface ModifyGetterAPI<Self, Value> {
  self: Self
  originalValue: Value
  random: Random
}

export interface ModifyReturnedAPI<Self, Fn extends () => any> {
  self: Self
  originalFunction: Fn
  originalArgs: Parameters<Fn>
  originalReturned: ReturnType<Fn>
  random: Random
}

declare global {
  interface Window {
    __thimbleRootState?: RootState
    __thimbleModified?: boolean
  }
}

interface RootState {
  readonly seed: number
  readonly mimicFunctions: WeakMap<object, object>
}

function getRootState(): RootState {
  let rootState = window.top?.__thimbleRootState ?? window.__thimbleRootState
  if (!rootState) {
    rootState = {
      seed: (Math.random() * 4294967295) >>> 0,
      mimicFunctions: new WeakMap(),
    }
    window.__thimbleRootState = rootState
  }
  return rootState
}

export function install(scope: Scope) {
  // TODO(2023-11-14): Make this undetectable somehow?
  try {
    if (scope.__thimbleModified) {
      return
    }
    scope.__thimbleModified = true
  } catch (error) {
    console.log('Error modifying frame, could be cross-origin?', error)
    return
  }

  console.log('Applying patches to scope')

  const { seed, mimicFunctions } = getRootState()
  let nextModificationId = 0

  function createMimicFunction<Fn extends (...args: any[]) => any>(
    originalFunction: Fn,
    newFunction: Fn,
  ) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { mimic } = {
      mimic(...args: unknown[]) {
        return newFunction.call(this, ...args)
      },
    }
    Object.defineProperty(mimic, 'name', { value: originalFunction.name })
    Object.defineProperty(mimic, 'length', { value: originalFunction.length })
    mimicFunctions.set(mimic, originalFunction)
    return mimic
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalFunctionToString = scope.Function.prototype.toString
  const mimicFunctionToString = createMimicFunction(
    originalFunctionToString,
    function (this: any) {
      const self = mimicFunctions.get(this) ?? this
      return originalFunctionToString.call(self)
    },
  )
  scope.Function.prototype.toString = mimicFunctionToString

  const modifyValue: Modifier['modifyValue'] = (obj, prop, getNewValue) => {
    const modId = nextModificationId++

    if (!obj) {
      return
    }

    const descriptor = Object.getOwnPropertyDescriptor(obj, prop)
    if (!descriptor) {
      // throw new Error(`Missing descriptor: ${prop.toString()}`);
      return
    }

    const api = {
      originalValue: descriptor.value,
      random: new Random(seed).mutateByUInt32(modId),
    }
    const newValue = getNewValue(api)
    Object.defineProperty(obj, prop, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value:
        typeof newValue === 'function'
          ? createMimicFunction(descriptor.value, newValue)
          : newValue,
    })
  }

  const modifyGetter: Modifier['modifyGetter'] = (obj, prop, newGetter) => {
    const modId = nextModificationId++

    if (!obj) {
      return
    }

    const descriptor = Object.getOwnPropertyDescriptor(obj, prop)
    if (!descriptor?.get) {
      // throw new Error(`Missing descriptor: ${prop.toString()}`);
      return
    }

    Object.defineProperty(obj, prop, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      set: descriptor.set,
      get: createMimicFunction(descriptor.get, function (this: any) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const originalValue = descriptor.get!.call(this)
        const api = {
          originalValue,
          random: new Random(seed).mutateByUInt32(modId),
          self: this,
        }
        return newGetter(api)
      }),
    })
  }

  const modifyReturned: Modifier['modifyReturned'] = (obj, prop, filter) => {
    modifyValue(obj, prop, (api) => {
      return function (this: any, ...originalArgs: any[]) {
        const originalFunction = api.originalValue
        return filter({
          self: this,
          originalFunction: originalFunction as any,
          originalArgs: originalArgs as any,
          originalReturned: (api.originalValue as (...args: any[]) => any).call(
            this,
            ...originalArgs,
          ),
          random: api.random.clone(),
        })
      } as any
    })
  }

  const api: Modifier = {
    scope,
    modifyValue,
    modifyReturned,
    modifyGetter,
  }

  for (const mod of enabledMods) {
    mod(api)
  }
}
