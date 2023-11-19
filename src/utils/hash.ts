export function hash(data: Uint8Array | Uint8ClampedArray): number {
  let a = 1,
    b = 0,
    M = 0
  const length = data.length
  for (let i = 0; i < length; ) {
    M = Math.min(length - i, 2654) + i
    for (; i < M; i++) {
      a += data[i] & 0xff
      b += a
    }
    a = 15 * (a >>> 16) + (a & 65535)
    b = 15 * (b >>> 16) + (b & 65535)
  }
  return (b % 65521 << 16) | a % 65521
}
