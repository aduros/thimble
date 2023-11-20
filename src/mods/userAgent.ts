import { Modifier } from '../install'

declare global {
  // Not yet in Typescript
  interface Navigator {
    userAgentData?: unknown
  }
}

export function modifyUserAgent({ scope, modifyGetter }: Modifier) {
  // Append some noise to the end of the UA
  modifyGetter(
    scope.Navigator.prototype,
    'userAgent',
    ({ originalValue, random }) => {
      return `${originalValue} Thmbl${random.nextWord(2)}/${random
        .nextFloatBetween(100, 999.995)
        .toFixed(2)}`
    },
  )

  // Disable navigator.userAgentData
  delete scope.Navigator.prototype.userAgentData
}
