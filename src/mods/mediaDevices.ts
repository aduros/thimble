import { Modifier } from '../install'

export function modifyMediaDevices({ scope, modifyReturned }: Modifier) {
  modifyReturned(
    scope.MediaDevices.prototype,
    'enumerateDevices',
    async ({ originalReturned, random }) => {
      return random.nextShuffle(await originalReturned)
    },
  )
}
