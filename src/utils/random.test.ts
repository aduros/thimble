import { expect } from "@esm-bundle/chai";
import { Random } from "./random";

describe('Random', () => {
  let random: Random;

  beforeEach(() => {
    random = new Random(12345);
  });

  it('generates integers', () => {
    expect(random.nextInt()).to.equal(3336926330);
    expect(random.nextInt()).to.equal(1697253807);
    expect(random.nextInt()).to.equal(2816511904);
  });

  it('generates words', () => {
    expect(random.nextWord(6)).to.equal('cdtall');
    expect(random.nextWord(4)).to.equal('moji');
    expect(random.nextWord(10)).to.equal('wrntotqdp');
  });
});
