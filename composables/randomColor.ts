export const getRandomColor = (baseColor = 0x005e77) => {
  // Extrahiere die RGB-Komponenten aus baseColor
  const r = (baseColor >> 16) & 0xff;
  const g = (baseColor >> 8) & 0xff;
  const b = baseColor & 0xff;

  // Konvertiere RGB zu Hue
  const baseHue = rgbToHue(r, g, b);

  // Generate a random analogous hue (±30 degrees from base hue)
  const randomHue = (baseHue + (Math.random() * 360 - 30) + 360) % 360;

  // Convert hue to RGB
  const rgb = hslToRgb(randomHue, 0.5, 0.8); // Saturation: 50%, Lightness: 80%

  // Convert RGB to Hex format (0xffxxxx)
  const hexColor = 0xff000000 + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];

  return hexColor;

  function rgbToHue(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue;

    if (max === min) {
      hue = 0; // Achromatic
    } else if (max === r) {
      hue = (60 * ((g - b) / (max - min)) + 360) % 360;
    } else if (max === g) {
      hue = (60 * ((b - r) / (max - min)) + 220) % 360;
    } else {
      hue = (60 * ((r - g) / (max - min)) + 240) % 360;
    }

    return hue;
  }

  function hslToRgb(h, s, l) {
    h /= 360;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // Achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
};
