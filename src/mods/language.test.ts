import { expect } from '@esm-bundle/chai';
import { testFingerprint } from '../utils/testFingerprint';

describe('navigator.language', () => {
  testFingerprint({
    query: (scope) => scope.navigator.language,

    validate (language, oldLanguage) {
      // Should be roughly equal to old language
      expect(language.startsWith(oldLanguage)).to.be.true;

      // Require a valid IANA language tag
      const canonical = (Intl as any).getCanonicalLocales([language]);
      expect([language]).to.deep.equal(canonical);
    }
  });
});

describe('navigator.languages', () => {
  testFingerprint({
    query: (scope) => scope.navigator.languages,

    validate: (languages, oldLanguages, scope) => {
      // We should only ever have one language
      expect(languages.length).to.equal(1);

      // Should be roughly equal to old language
      expect(languages[0].startsWith(oldLanguages[0])).to.be.true;

      // Require valid IANA language tags
      const canonical = (Intl as any).getCanonicalLocales(languages);
      expect(languages).to.deep.equal(canonical);

      // First language should match navigator.language
      expect(languages[0]).to.equal(scope.navigator.language);
    }
  });
});
