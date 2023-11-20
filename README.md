<h1 align="center">
  <br>
  <img src="https://github.com/aduros/thimble/raw/main/src/icon.svg" alt="Thimble Logo" width="200">
  <br>
  Thimble
  <br>
</h1>

<h3 align="center">Privacy extension to protect your browser fingerprint ☝️</h3>

<h4 align="center">
  Download for
  <a href="#">Chrome</a> /
  <a href="#">Firefox</a>
</h4>

## About

> Development status: ⚡ Alpha

Thimble works by slightly randomizing values returned by JS APIs commonly used for fingerprinting.

- Audio: Applies imperceptible noise to audio data readouts.
- Battery state: Randomizes between "charging" and "discharging". Randomize battery level between 90 and 100%.
- CPU cores: Randomizes between 2 and the actual CPU core count.
- Canvas: Applies imperceptible noise to pixel data readouts.
- Device memory: Randomizes reported available memory.
- "Do not track" preference: Randomly toggled.
- Fonts: Applies imperceptible noise to DOM size calculation used for font detection.
- GPU info: Randomizes WebGL parameters, disables APIs for getting unmasked GPU vendor and renderer.
- Language: Appends a random private-use language tag. Limits number of languages to 1.
- Media formats: Randomly flip between "probably" and "maybe" media format support.
- Media devices: Shuffles available media devices.
- Screen dimensions and window position: Randomized.
- Storage quota: Randomly reports between 2 and 32 GB available.
- User agent: Appends a random suffix.

The goal is to add as much noise as possible to break fingerprinting without impacting user experience.

## Status

As of this writing (Nov 2023), Thimble passes these fingerprinting tests:

- [FingerprintJS Free](https://fingerprintjs.github.io/fingerprintjs/)
- [FingerprintJS Commercial](https://fingerprint.com/demo/) (clear cookies between tests)
- [CreepJS](https://abrahamjuliot.github.io/creepjs/)
- [Browserleaks Canvas](https://browserleaks.com/canvas)
- [Browserleaks Fonts](https://browserleaks.com/fonts)
- [Browserleaks WebGL](https://browserleaks.com/webgl)

You should get a randomized fingerprint upon each reload.
