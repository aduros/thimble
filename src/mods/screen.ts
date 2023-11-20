import { Modifier, ModifyValueAPI } from '../install'

declare global {
  interface Screen {
    availTop: number
    availLeft: number
  }
}

export function modifyScreen({ scope, modifyGetter }: Modifier) {
  function randomizeValue({ originalValue, random }: ModifyValueAPI<number>) {
    return Math.round(originalValue * random.nextFloatBetween(1, 1.25))
  }

  modifyGetter(scope.Screen.prototype, 'width', randomizeValue)
  modifyGetter(scope.Screen.prototype, 'availLeft', randomizeValue)
  modifyGetter(
    scope.Screen.prototype,
    'availWidth',
    ({ self }) => self.width - self.availLeft,
  )

  modifyGetter(scope.Screen.prototype, 'height', randomizeValue)
  modifyGetter(scope.Screen.prototype, 'availTop', randomizeValue)
  modifyGetter(
    scope.Screen.prototype,
    'availHeight',
    ({ self }) => self.height - self.availTop,
  )

  modifyGetter(scope.Screen.prototype, 'colorDepth', ({ random }) =>
    random.nextChoice([24, 30]),
  )
  modifyGetter(
    scope.Screen.prototype,
    'pixelDepth',
    ({ self }) => self.colorDepth,
  )

  modifyGetter(scope, 'screenX', randomizeValue)
  modifyGetter(scope, 'screenLeft', ({ self }) => self.screenX)

  modifyGetter(scope, 'screenY', randomizeValue)
  modifyGetter(scope, 'screenTop', ({ self }) => self.screenY)

  modifyGetter(
    scope,
    'devicePixelRatio',
    ({ originalValue, random }) =>
      originalValue * random.nextFloatBetween(1, 1.01),
  )
}
