import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';

describe('navigator.language', () => {
  testFingerprint({
    query: (scope) => scope.navigator.language,

    // TODO(2023-11-15): Validate IANA language tag
    validate (language) {
      // expect(language).to.be
    }
  });
});

describe('navigator.languages', () => {
  testFingerprint({
    query: (scope) => scope.navigator.languages,

    // TODO(2023-11-15): Validate IANA language tag
    validate: (languages, _, scope) => {
      expect(languages.length).to.equal(1);
      expect(languages[0]).to.equal(scope.navigator.language);
    }
  });
});
