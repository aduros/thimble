export class Random {
  constructor (public state: number) {
  }

  mutateByUInt32 (n: number): this {
    this.state = (this.state + n) >>> 0;
    return this;
  }

  // mutateByUInt8Array... hash

  /** Generate the next 32 bit integer. */
  nextInt(): number {
    let x = this.state;
    x = (x ^ (x << 13)) >>> 0;
    x = (x ^ (x >> 17)) >>> 0;
    x = (x ^ (x << 5)) >>> 0;
    return this.state = x;
  }

  /** Generate the next 32 bit integer between two values. */
  nextIntBetween(lowerInclusive: number, upperInclusive: number): number {
    return lowerInclusive + this.nextInt() % (upperInclusive - lowerInclusive + 1);
  }

  /** Generate the next float between 0 (inclusive) and 1 (exclusive). */
  nextFloat(): number {
    return this.nextInt() / 0x7fffffff;
  }

  /** Generate the next float between two values. */
  nextFloatBetween(lowerInclusive: number, upperExclusive: number): number {
    return lowerInclusive + this.nextFloat() * (upperExclusive - lowerInclusive);
  }

  nextWord(length: number): string {
    let word = "";
    for (let ii = 0; ii < length; ++ii) {
      word += 'abcdefghijklmnopqrstuvwxyz'.charAt(this.nextIntBetween(0, 26));
    }
    return word;
  }
}
