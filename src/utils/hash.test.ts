import { expect } from '@esm-bundle/chai'
import { hash } from './hash'

describe('hash', () => {
  it('returns correct values', () => {
    expect(
      hash(new Uint8Array([87, 105, 107, 105, 112, 101, 100, 105, 97])),
    ).to.equal(300286872)
  })
})
