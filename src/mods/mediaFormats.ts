import { Modifier } from '../install'

export function modifyMediaFormats({ scope, modifyReturned }: Modifier) {
  modifyReturned(
    scope.HTMLMediaElement.prototype,
    'canPlayType',
    ({ originalArgs, originalReturned, random }) => {
      // Randomly swap "probably" and "maybe"
      if (
        originalReturned &&
        random.mutateByString(originalArgs[0]).nextBoolean()
      ) {
        switch (originalReturned) {
          case 'probably':
            return 'maybe'
          case 'maybe':
            return 'probably'
          default:
            originalReturned satisfies never
        }
      }
      return originalReturned
    },
  )
}
