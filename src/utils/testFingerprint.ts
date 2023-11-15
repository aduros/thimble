import { expect } from "@esm-bundle/chai";
import { Scope, modifyAll } from "../mods";

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

export interface TestFingerprintOptions<T> {
  query: (scope: Scope) => T | Promise<T>
  expectDifferences?: boolean
  validate: (value: T, originalValue: T, scope: Scope) => void | Promise<void>
}

export function testFingerprint<T> (opts: TestFingerprintOptions<T>) {
  let scope: Scope
  let originalValue: T
  let fakeValue: T

  beforeEach(async () => {
    scope = await createIFrameScope(window);
    originalValue = await opts.query(scope);
    modifyAll(scope);
    fakeValue = await opts.query(scope);
  })

  it('should remain stable across multiple queries', async () => {
    for (let ii = 0; ii < 3; ++ii) {
      expect(await opts.query(scope)).to.deep.equal(fakeValue);
    }
  });

  it('should have the same fake value across all scopes', async () => {
    const iframe = await createIFrameScope(scope);
    for (let ii = 0; ii < 3; ++ii) {
      expect(await opts.query(iframe)).to.deep.equal(fakeValue);
    }
  });

  it('should be a valid fake', async () => {
    await opts.validate(fakeValue, originalValue, scope);
  })

  if (opts.expectDifferences ?? true) {
    it('should differ from the original value', () => {
      expect(fakeValue).to.not.deep.equal(originalValue);
    })
  }
}
