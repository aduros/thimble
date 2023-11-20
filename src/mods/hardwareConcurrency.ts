import { Modifier } from '../install'

export function modifyHardwareConcurrency({ scope, modifyGetter }: Modifier) {
  modifyGetter(
    scope.Navigator.prototype,
    'hardwareConcurrency',
    ({ originalValue, random }) => {
      return originalValue > 2
        ? random.nextIntBetween(2, originalValue)
        : originalValue
    },
  )
}
