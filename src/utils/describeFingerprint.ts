import { expect } from '@esm-bundle/chai'
import { Scope, install } from '../install'

function createIFrameScope(parentScope: Scope): Promise<Scope> {
  const iframeElement = parentScope.document.createElement('iframe')
  return new Promise((resolve, reject) => {
    iframeElement.addEventListener('load', () => {
      resolve(iframeElement.contentWindow as Scope)
    })
    iframeElement.addEventListener('error', (event) => {
      reject(event.error)
    })
    iframeElement.src = 'about:blank'
    parentScope.document.body.appendChild(iframeElement)
  })
}

/** Create a snapshot of an object, stripping all getters and functions. */
function deepClone<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(deepClone) as T
  }
  if (obj != null && typeof obj === 'object') {
    const copy = {} as typeof obj
    for (const propName in obj) {
      const propValue = obj[propName]
      if (typeof propValue !== 'function') {
        copy[propName] = deepClone(propValue)
      }
    }
    return copy
  }
  return obj
}

export interface DescribeFingerprintOptions<Value> {
  query: (scope: Scope) => Value | Promise<Value>
  validate: (
    value: Value,
    originalValue: Value,
    scope: Scope,
  ) => void | Promise<void>
}

export function describeFingerprint<Value>(
  title: string,
  opts: DescribeFingerprintOptions<Value>,
) {
  describe(title, () => {
    let scope: Scope
    let originalValue: Value
    let fakeValue: Value

    async function query(scope: Scope): Promise<Value> {
      const value = await opts.query(scope)
      return deepClone(value)
    }

    beforeEach(async () => {
      scope = await createIFrameScope(window)
      originalValue = await query(scope)

      window.__thimbleRootState = {
        seed: 12345, // Use a preset seed to keep tests deterministic
        mimicFunctions: new WeakMap(),
      }
      install(scope)

      fakeValue = await query(scope)
    })

    it('should remain stable across multiple queries', async () => {
      for (let ii = 0; ii < 3; ++ii) {
        expect(await query(scope)).to.deep.equal(fakeValue)
      }
    })

    it('should have the same fake value across all scopes', async () => {
      const iframe = await createIFrameScope(scope)
      for (let ii = 0; ii < 3; ++ii) {
        expect(await query(iframe)).to.deep.equal(fakeValue)
      }
    })

    it('should be a valid fake', async () => {
      await opts.validate(fakeValue, originalValue, scope)
    })
  })
}
