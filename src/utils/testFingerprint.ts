import { expect } from "@esm-bundle/chai";
import { Scope, init } from "../mods";

function createIFrameScope (parentScope: Scope): Promise<Scope> {
  const iframeElement = parentScope.document.createElement('iframe');
  return new Promise((resolve, reject) => {
    iframeElement.addEventListener('load', () => {
      resolve(iframeElement.contentWindow as Scope);
    });
    iframeElement.addEventListener('error', (event) => {
      reject(event.error);
    });
    iframeElement.src = 'about:blank';
    parentScope.document.body.appendChild(iframeElement);
  });
}

function deepClone<T> (obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(deepClone) as T;
  }
  if (obj != null && typeof obj === 'object') {
    const copy = {} as typeof obj;
    for (const prop in obj) {
      copy[prop] = deepClone(obj[prop]);
    }
    return copy;
  }
  return obj;
}

export interface TestFingerprintOptions<T> {
  query: (scope: Scope) => T | Promise<T>
  validate: (value: T, originalValue: T, scope: Scope) => void | Promise<void>
}

export function testFingerprint<T> (opts: TestFingerprintOptions<T>) {
  let scope: Scope
  let originalValue: T
  let fakeValue: T

  async function query (scope: Scope): Promise<T> {
    const value = await opts.query(scope);
    return deepClone(value);
  }

  beforeEach(async () => {
    scope = await createIFrameScope(window);
    originalValue = await query(scope);
    init(12345, scope);
    fakeValue = await query(scope);
  })

  it('should remain stable across multiple queries', async () => {
    for (let ii = 0; ii < 3; ++ii) {
      expect(await query(scope)).to.deep.equal(fakeValue);
    }
  });

  // TODO(2023-11-16): Re-enable this
  it.skip('should have the same fake value across all scopes', async () => {
    const iframe = await createIFrameScope(scope);
    for (let ii = 0; ii < 3; ++ii) {
      expect(await query(iframe)).to.deep.equal(fakeValue);
    }
  });

  it('should be a valid fake', async () => {
    await opts.validate(fakeValue, originalValue, scope);
  })

  // if (opts.expectDifferences ?? true) {
  //   it('should differ from the original value', () => {
  //     expect(fakeValue).to.not.deep.equal(originalValue);
  //   })
  // }
}
