export function hash (data: Uint8Array | Uint8ClampedArray): number {
  var a = 1, b = 0, length = data.length, M = 0;
	for(var i = 0; i < length;) {
		M = Math.min(length-i, 2654)+i;
		for(;i<M;i++) {
			a += data[i]&0xFF;
			b += a;
		}
		a = (15*(a>>>16)+(a&65535));
		b = (15*(b>>>16)+(b&65535));
	}
	return ((b%65521) << 16) | (a%65521);
}
