import { Modifier, ModifyValueAPI } from '../install'

export function modifyCanvas({
  scope,
  modifyReturned,
  modifyGetter,
  modifyValue,
}: Modifier) {
  function randomizeValue({ originalValue, random }: ModifyValueAPI<number>) {
    return (
      originalValue *
      (1 +
        random.mutateByFloat(originalValue).nextFloatBetween(-0.0005, 0.0005))
    )
  }

  // Since TextMetrics is still evolving, just modify all getters instead of specifying them individually
  const textMetricsDescriptors = Object.getOwnPropertyDescriptors(
    scope.TextMetrics.prototype,
  )
  for (const [prop, descriptor] of Object.entries(textMetricsDescriptors)) {
    if (descriptor.get) {
      modifyGetter(
        scope.TextMetrics.prototype,
        prop as keyof TextMetrics,
        randomizeValue,
      )
    }
  }

  modifyReturned(
    scope.CanvasRenderingContext2D.prototype,
    'getImageData',
    ({ originalReturned, random }) => {
      const data = originalReturned.data

      // Mutate the RNG to prevent attackers from undoing the noise by using a known preset
      random.mutateByBytes(data)

      for (let ii = 0, ll = data.length - 4; ii < ll; ++ii) {
        const channel = data[ii]

        // Only adjust channels that are different from the next pixel
        if (data[ii + 4] !== channel) {
          data[ii] = channel ^ (random.nextInt() & 1)
        }
      }

      return originalReturned
    },
  )

  function createNoisedCopy(
    sourceCanvas: HTMLCanvasElement,
  ): HTMLCanvasElement {
    const copyCanvas = scope.document.createElement('canvas')
    copyCanvas.width = sourceCanvas.width
    copyCanvas.height = sourceCanvas.height

    const copyCtx = copyCanvas.getContext('2d', { willReadFrequently: true })
    if (!copyCtx) {
      return sourceCanvas
    }

    copyCtx.globalCompositeOperation = 'copy'
    copyCtx.drawImage(sourceCanvas, 0, 0)

    const imageData = copyCtx.getImageData(
      0,
      0,
      copyCanvas.width,
      copyCanvas.height,
    )
    copyCtx.putImageData(imageData, 0, 0)

    return copyCanvas
  }

  modifyValue(
    scope.HTMLCanvasElement.prototype,
    'toDataURL',
    ({ originalValue }) => {
      return function (this: HTMLCanvasElement, ...args) {
        return originalValue.call(createNoisedCopy(this), ...args)
      }
    },
  )

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalToBlob = scope.HTMLCanvasElement.prototype.toBlob

  modifyValue(
    scope.HTMLCanvasElement.prototype,
    'toBlob',
    ({ originalValue }) => {
      return function (this: HTMLCanvasElement, ...args) {
        originalValue.call(createNoisedCopy(this), ...args)
      }
    },
  )

  modifyValue(scope.OffscreenCanvas?.prototype, 'convertToBlob', () => {
    return function (this: OffscreenCanvas, opts) {
      const type = opts?.type
      const quality = opts?.quality

      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height

        const imageBitmap = this.transferToImageBitmap()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(imageBitmap, 0, 0)
        imageBitmap.close()

        originalToBlob.call(
          createNoisedCopy(canvas),
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('OffscreenCanvas.convertToBlob failed'))
            }
          },
          type,
          quality,
        )
      })
    }
  })
}
