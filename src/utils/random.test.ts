import { expect } from '@esm-bundle/chai'
import { Random } from './random'

describe('Random', () => {
  let random: Random

  beforeEach(() => {
    random = new Random(12345)
  })

  it('generates integers', () => {
    expect(random.nextInt()).to.equal(3336926330)
    expect(random.nextInt()).to.equal(1697253807)
    expect(random.nextInt()).to.equal(2816511904)
  })

  it('generates words', () => {
    expect(random.nextWord(6)).to.equal('kpyect')
    expect(random.nextWord(4)).to.equal('vsyy')
    expect(random.nextWord(10)).to.equal('ixsgqtalvp')
  })

  it('generates shuffles', () => {
    expect(random.nextShuffle([1, 2, 3, 4, 5])).to.deep.equal([1, 3, 5, 2, 4])
    expect(random.nextShuffle([1, 2, 3, 4, 5])).to.deep.equal([4, 2, 3, 5, 1])
    expect(random.nextShuffle([1, 2, 3, 4, 5])).to.deep.equal([4, 3, 5, 1, 2])
  })

  it('correctly mutates', () => {
    expect(random.nextInt()).to.equal(3336926330)

    random.mutateByUInt32(666)
    expect(random.nextInt()).to.equal(1761583607)

    random.mutateByString('hello')
    expect(random.nextInt()).to.equal(1861161721)

    random.mutateByFloat(123.456)
    expect(random.nextInt()).to.equal(3273446311)
  })
})
