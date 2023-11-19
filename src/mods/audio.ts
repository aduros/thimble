import { Scope, modifyFunctionReturnValue, modifyValue } from '.';

export function modifyAudio (scope: Scope) {
  modifyFunctionReturnValue(scope.AudioBuffer.prototype, 'getChannelData', ({ originalReturnValue, random }) => {
    // TODO(2023-11-18): random.mutateByBytes(originalReturnValue)
    const offset = random.nextFloatBetween(-0.0005, 0.0005);
    for (let idx = 0; idx < originalReturnValue.length; ++idx) {
      originalReturnValue[idx] = (originalReturnValue[idx] + offset) * (1 + random.nextFloatBetween(-0.0005, 0.0005));
    }
    return originalReturnValue;
  });

  modifyValue(scope.AudioBuffer.prototype, 'copyFromChannel', () => {
    return function (this: AudioBuffer, destination, channelNumber, startInChannel) {
      const channelData = this.getChannelData(channelNumber).subarray(startInChannel);
      destination.set(channelData.subarray(0, Math.min(channelData.length, destination.length)));
    }
  });

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
