import { expect } from '@esm-bundle/chai'
import { describeFingerprint } from '../utils/describeFingerprint'

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Intl {
  // https://github.com/microsoft/TypeScript/issues/29129
  function getCanonicalLocales(languages: string | readonly string[]): string[]
}

describeFingerprint('Navigator.language', {
  query: (scope) => scope.navigator.language,

  validate(language, oldLanguage) {
    // Should be roughly equal to old language
    expect(language.startsWith(oldLanguage)).to.be.true

    // Require a valid IANA language tag
    const canonical = Intl.getCanonicalLocales([language])
    expect([language]).to.deep.equal(canonical)
  },
})

describeFingerprint('Navigator.languages', {
  query: (scope) => scope.navigator.languages,

  validate: (languages, oldLanguages, scope) => {
    // We should only ever have one language
    expect(languages.length).to.equal(1)

    // Should be roughly equal to old language
    expect(languages[0].startsWith(oldLanguages[0])).to.be.true

    // Require valid IANA language tags
    const canonical = Intl.getCanonicalLocales(languages)
    expect(languages).to.deep.equal(canonical)

    // First language should match navigator.language
    expect(languages[0]).to.equal(scope.navigator.language)
  },
})
