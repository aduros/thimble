import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';

describe('navigator.language', () => {
  testFingerprint({
    query: (scope) => scope.navigator.language,

    validate (language) {
      // Require a valid IANA language tag
      const canonical = (Intl as any).getCanonicalLocales([language]);
      expect([language]).to.deep.equal(canonical);
    }
  });
});

describe('navigator.languages', () => {
  testFingerprint({
    query: (scope) => scope.navigator.languages,

    validate: (languages, _, scope) => {
      // Require valid IANA language tags
      const canonical = (Intl as any).getCanonicalLocales(languages);
      expect(languages).to.deep.equal(canonical);

      expect(languages.length).to.equal(1);
      expect(languages[0]).to.equal(scope.navigator.language);
    }
  });
});
