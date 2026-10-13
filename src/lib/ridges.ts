// Draws soft mountain ridgelines as SVG paths at build time. Each layer is a sum of a few sine waves,
// so the same seed always gives the same mountains and nothing loads from an image file.

export interface Ridge {
  d: string;
  fill: string;
}

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function ridges(opts: {
  width: number;
  height: number;
  colors: string[];
  seed?: number;
  /** Where the furthest ridge sits, as a share of the height from the top. */
  top?: number;
  /** Where the nearest ridge sits. */
  bottom?: number;
  flip?: boolean;
}): Ridge[] {
  const { width, height, colors, seed = 7, top = 0.35, bottom = 0.78, flip = false } = opts;
  const r = rand(seed);
  const layers = colors.length;

  return colors.map((fill, i) => {
    const t = layers === 1 ? 1 : i / (layers - 1);
    const base = height * (top + (bottom - top) * t);
    // Far ridges are tall and gentle, near ridges are lower and rougher.
    const waves = [
      { a: height * (0.16 - 0.07 * t), f: 1 + r() * 0.8, p: r() * Math.PI * 2 },
      { a: height * (0.05 + 0.02 * t), f: 3 + r() * 2, p: r() * Math.PI * 2 },
      { a: height * (0.012 + 0.012 * t), f: 9 + r() * 6, p: r() * Math.PI * 2 },
    ];
    const steps = 96;
    const pts: string[] = [];
    for (let s = 0; s <= steps; s++) {
      const x = (s / steps) * width;
      const u = s / steps;
      let y = base;
      // The broad swell is a plain sine. The smaller waves are "ridged" (1 - |sin|), which gives sharp peaks
      // and rounded valleys, so the layers read as mountains rather than rolling hills.
      waves.forEach((w, k) => {
        const s = Math.sin(u * Math.PI * w.f + w.p);
        y -= k === 0 ? w.a * s : w.a * (1.6 * (1 - Math.abs(s)) - 0.8);
      });
      y = flip ? height - y : y;
      pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    const edge = flip ? 0 : height;
    return { d: `M0 ${edge}L${pts.join('L')}L${width} ${edge}Z`, fill };
  });
}
