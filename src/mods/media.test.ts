import { expect } from '@esm-bundle/chai';
import { describeFingerprint } from '../utils/describeFingerprint';

describeFingerprint('HTMLMediaElement.canPlayType', {
  query (scope) {
    const mediaTypes = [
      'audio/aac',
      'audio/mpeg',
      'audio/ogg; codecs="vorbis"',
      'audio/wav; codecs="1"',
      'audio/x-m4a',
      'video/mp4; codecs="avc1.42E01E"',
      'video/ogg; codecs="theora"',
      'video/webm; codecs="vp8"',
      'video/webm; codecs="vp9"',
      'video/x-matroska',
      'other/x-unknown',
    ];

    const video = scope.document.createElement('video');
    return Object.fromEntries(mediaTypes.map(type => ([type, video.canPlayType(type)])));
  },

  validate (mediaTypes, originalMediaTypes) {
    expect(mediaTypes).to.not.deep.equal(originalMediaTypes);
  }
});
