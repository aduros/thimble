import { Modifier } from '../install'

export function modifyAudio({ scope, modifyReturned, modifyValue }: Modifier) {
  modifyReturned(
    scope.AudioBuffer.prototype,
    'getChannelData',
    ({ originalReturned, random }) => {
      // const offset = 0; // random.nextFloatBetween(-0.25, 0.25);
      // for (let idx = 0; idx < channelData.length; idx += 10) {
      //   channelData[idx] += offset + random.nextFloatBetween(-0.05, 0.05);
      // }
      const offset = random.nextFloatBetween(-0.0005, 0.0005)
      for (let idx = 0; idx < originalReturned.length; ++idx) {
        originalReturned[idx] =
          (originalReturned[idx] + offset) *
          (1 + random.nextFloatBetween(-0.0005, 0.0005))
      }
      return originalReturned
    },
  )

  modifyValue(scope.AudioBuffer.prototype, 'copyFromChannel', () => {
    return function (
      this: AudioBuffer,
      destination,
      channelNumber,
      startInChannel,
    ) {
      const channelData =
        this.getChannelData(channelNumber).subarray(startInChannel)
      destination.set(
        channelData.subarray(
          0,
          Math.min(channelData.length, destination.length),
        ),
      )
    }
  })

  // addPatch(scope.OfflineAudioCompletionEvent.prototype, 'renderedBuffer', (renderedBuffer, random) => {
  //   console.log("returning renderedBuffer");

  //   for (let channel = 0; channel < renderedBuffer.numberOfChannels; ++channel) {
  //     const channelData = renderedBuffer.getChannelData(channel);

  //     const offset = random.nextFloatBetween(-0.25, 0.25);
  //     for (let idx = 0; idx < channelData.length; ++idx) {
  //       channelData[idx] += offset + random.nextFloatBetween(-0.05, 0.05);
  //     }
  //     console.log('Rejiggering channelData');

  //     renderedBuffer.copyToChannel(channelData, channel);
  //   }
  //   return renderedBuffer;
  // });
}
