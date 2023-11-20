import { hash } from './hash'

export class Random {
  constructor(public state: number) {}

  clone(): Random {
    return new Random(this.state)
  }

  mutateByUInt32(n: number): this {
    this.state = (this.state + n) >>> 0
    return this
  }

  mutateByFloat(n: number): this {
    const buffer = new ArrayBuffer(4)
    const float32View = new Float32Array(buffer)
    const uint32View = new Uint32Array(buffer)
    float32View[0] = n
    return this.mutateByUInt32(uint32View[0])
  }

  mutateByBytes(bytes: Uint8Array | Uint8ClampedArray): this {
    return this.mutateByUInt32(hash(bytes))
  }

  mutateByString(str: string): this {
    return this.mutateByBytes(new TextEncoder().encode(str))
  }

  // mutateByUInt8Array... hash

  /** Generate the next 32 bit integer. */
  nextInt(): number {
    let x = this.state
    x = (x ^ (x << 13)) >>> 0
    x = (x ^ (x >> 17)) >>> 0
    x = (x ^ (x << 5)) >>> 0
    return (this.state = x)
  }

  /** Generate the next 32 bit integer between two values. */
  nextIntBetween(lowerInclusive: number, upperInclusive: number): number {
    return (
      lowerInclusive + (this.nextInt() % (upperInclusive - lowerInclusive + 1))
    )
  }

  /** Generate the next float between 0 (inclusive) and 1 (exclusive). */
  nextFloat(): number {
    return this.nextInt() / 0xffffffff
  }

  /** Generate the next float between two values. */
  nextFloatBetween(lowerInclusive: number, upperExclusive: number): number {
    return lowerInclusive + this.nextFloat() * (upperExclusive - lowerInclusive)
  }

  nextBoolean(): boolean {
    return (this.nextInt() & 1) === 1
  }

  nextWord(length: number): string {
    let word = ''
    for (let ii = 0; ii < length; ++ii) {
      word += 'abcdefghijklmnopqrstuvwxyz'.charAt(this.nextInt() % 26)
    }
    return word
  }

  nextChoice<T>(options: readonly T[]): T {
    return options[this.nextInt() % options.length]
  }

  nextShuffle<T>(source: readonly T[]): T[] {
    const copy = new Array<T>(source.length)
    for (let ii = 0; ii < copy.length; ++ii) {
      const swapIdx = this.nextInt() % (ii + 1)
      if (swapIdx !== ii) {
        copy[ii] = copy[swapIdx]
      }
      copy[swapIdx] = source[ii]
    }
    return copy
  }
}
