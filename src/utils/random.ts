/** LCG random number generator. */
export class Random {
  constructor (public seed: number) {
  }

  nextInt(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed;
  }

  nextIntBetween(lowerInclusive: number, upperInclusive: number): number {
    return lowerInclusive + this.nextInt() % (upperInclusive - lowerInclusive + 1);
  }

  nextFloat(): number {
    return this.nextInt() / 0x7fffffff;
  }

  nextFloatBetween(lowerInclusive: number, upperExclusive: number): number {
    return lowerInclusive + this.nextFloat() * (upperExclusive - lowerInclusive);
  }
}
