import * as THREE from "three";

export const BLOCK_W = 3.2;
export const BLOCK_H = 1.5;
const LABEL_COLOR = [34, 34, 31];
const HEIGHT_BLUR_PX = 0.75;
const LABEL_DEPTH = 0.2;

function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let result = Math.imul(value ^ (value >>> 15), 1 | value);
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result;
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function makeValueNoise(random) {
  const size = 256;
  const grid = new Float32Array(size * size);
  for (let index = 0; index < grid.length; index += 1) grid[index] = random();
  const at = (x, y) => grid[((y & (size - 1)) * size + (x & (size - 1))) >>> 0];
  const fade = (value) => value * value * (3 - 2 * value);
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = fade(x - xi);
    const v = fade(y - yi);
    const a = at(xi, yi);
    const b = at(xi + 1, yi);
    const c = at(xi, yi + 1);
    const d = at(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

function fbm(noise, x, y) {
  let sum = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;
  for (let index = 0; index < 4; index += 1) {
    sum += noise(x * frequency, y * frequency) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2.03;
  }
  return sum / normalizer;
}

function paintConcrete(context, width, height, field, options) {
  const random = mulberry32(options.seed);
  const noise = makeValueNoise(mulberry32(options.seed ^ 0x9e3779b9));
  const image = context.createImageData(width, height);
  const scale = 6 / Math.min(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const broad = fbm(noise, x * scale, y * scale);
      const fine = noise(x * scale * 7.3 + 31.7, y * scale * 7.3 + 11.1);
      const luminance = THREE.MathUtils.clamp(options.base + (broad - 0.5) * 0.065 + (fine - 0.5) * 0.02, 0, 1);
      image.data[index * 4] = Math.round(luminance * 255 * options.tint[0]);
      image.data[index * 4 + 1] = Math.round(luminance * 255 * options.tint[1]);
      image.data[index * 4 + 2] = Math.round(luminance * 255 * options.tint[2]);
      image.data[index * 4 + 3] = 255;
      field[index] = luminance;
    }
  }
  context.putImageData(image, 0, 0);
  for (let index = 0; index < options.blotches; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = (0.06 + random() * 0.22) * Math.min(width, height);
    const dark = random() > 0.5;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    const alpha = 0.018 + random() * 0.03;
    gradient.addColorStop(0, dark ? `rgba(38,36,32,${alpha})` : `rgba(255,255,250,${alpha})`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  for (let index = 0; index < options.pebbles; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = 1 + random() * 2.8;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(${110 + Math.round(random() * 45)},${108 + Math.round(random() * 45)},${102 + Math.round(random() * 42)},${0.12 + random() * 0.15})`;
    context.fill();
  }
  for (let index = 0; index < options.speckles; index += 1) {
    context.fillStyle = random() > 0.45 ? "rgba(35,33,30,0.12)" : "rgba(255,255,251,0.11)";
    context.fillRect(random() * width, random() * height, 1, 1);
  }
  if (options.formwork) {
    for (const fraction of [0.16, 0.84]) {
      const x = fraction * width;
      const y = height / 2;
      const radius = Math.min(width, height) * 0.028;
      const gradient = context.createRadialGradient(x, y, radius * 0.2, x, y, radius);
      gradient.addColorStop(0, "rgba(45,43,39,0.16)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }
}

function paintLabel(context, width, height, label) {
  context.clearRect(0, 0, width, height);
  const fontPx = height * 0.32;
  context.font = `900 ${fontPx}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  context.textBaseline = "middle";
  context.textAlign = "left";
  const tracking = fontPx * 0.017;
  const glyphs = [...label];
  const naturalWidth = glyphs.reduce((sum, glyph) => sum + context.measureText(glyph).width, 0) + tracking * Math.max(0, glyphs.length - 1);
  const targetWidth = width * 0.7;
  const scale = Math.min(1, targetWidth / naturalWidth);
  context.save();
  context.translate(width / 2, height * 0.52);
  context.scale(scale, 1);
  let x = -naturalWidth / 2;
  for (const glyph of glyphs) {
    context.fillText(glyph, x, 0);
    x += context.measureText(glyph).width + tracking;
  }
  context.restore();
}

function engraveLabel(context, field, stride, region, label) {
  const crisp = document.createElement("canvas");
  crisp.width = region;
  crisp.height = region;
  const crispContext = crisp.getContext("2d");
  crispContext.fillStyle = "#fff";
  paintLabel(crispContext, region, region, label);
  const softened = document.createElement("canvas");
  softened.width = region;
  softened.height = region;
  const softenedContext = softened.getContext("2d");
  softenedContext.filter = `blur(${HEIGHT_BLUR_PX}px)`;
  softenedContext.drawImage(crisp, 0, 0);
  const albedoMask = crispContext.getImageData(0, 0, region, region).data;
  const heightMask = softenedContext.getImageData(0, 0, region, region).data;
  const image = context.getImageData(0, 0, region, region);
  for (let index = 0; index < region * region; index += 1) {
    const albedo = albedoMask[index * 4 + 3] / 255;
    const groove = heightMask[index * 4 + 3] / 255;
    if (groove) field[Math.floor(index / region) * stride + (index % region)] = Math.max(0, field[Math.floor(index / region) * stride + (index % region)] - groove * LABEL_DEPTH);
    if (albedo) {
      const blend = albedo;
      image.data[index * 4] = Math.round(image.data[index * 4] * (1 - blend) + LABEL_COLOR[0] * blend);
      image.data[index * 4 + 1] = Math.round(image.data[index * 4 + 1] * (1 - blend) + LABEL_COLOR[1] * blend);
      image.data[index * 4 + 2] = Math.round(image.data[index * 4 + 2] * (1 - blend) + LABEL_COLOR[2] * blend);
    }
  }
  context.putImageData(image, 0, 0);
}

export function createTextureDisposer(textures) {
  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    textures.forEach((texture) => texture.dispose());
  };
}

function heightToNormal(field, width, height, strength) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const image = context.createImageData(width, height);
  const at = (x, y) => field[Math.max(0, Math.min(height - 1, y)) * width + Math.max(0, Math.min(width - 1, x))];
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const dx = (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1)) * strength;
    const dy = (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1)) * strength;
    const inverse = 1 / Math.hypot(dx, dy, 1);
    const index = (y * width + x) * 4;
    image.data[index] = Math.round((-dx * inverse * 0.5 + 0.5) * 255);
    image.data[index + 1] = Math.round((dy * inverse * 0.5 + 0.5) * 255);
    image.data[index + 2] = Math.round((inverse * 0.5 + 0.5) * 255);
    image.data[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

function heightToRoughness(field, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const image = canvas.getContext("2d").createImageData(width, height);
  for (let index = 0; index < field.length; index += 1) {
    const roughness = THREE.MathUtils.clamp(Math.round(239 + (field[index] - 0.78) * 18), 226, 255);
    image.data[index * 4] = image.data[index * 4 + 1] = image.data[index * 4 + 2] = roughness;
    image.data[index * 4 + 3] = 255;
  }
  canvas.getContext("2d").putImageData(image, 0, 0);
  return canvas;
}

export function createConcreteTextures(label) {
  const atlas = document.createElement("canvas");
  atlas.width = 1024;
  atlas.height = 512;
  const context = atlas.getContext("2d");
  const front = document.createElement("canvas");
  front.width = front.height = 512;
  const frontField = new Float32Array(512 * 512);
  paintConcrete(front.getContext("2d"), 512, 512, frontField, { seed: 42, base: 0.78, tint: [1, 1, 0.99], speckles: 4800, pebbles: 120, blotches: 24, formwork: true });
  engraveLabel(front.getContext("2d"), frontField, 512, 512, label);
  const plain = document.createElement("canvas");
  plain.width = plain.height = 512;
  const plainField = new Float32Array(512 * 512);
  paintConcrete(plain.getContext("2d"), 512, 512, plainField, { seed: 77, base: 0.77, tint: [1, 1, 0.99], speckles: 3600, pebbles: 96, blotches: 20 });
  context.drawImage(front, 0, 0);
  context.drawImage(plain, 512, 0);
  const field = new Float32Array(1024 * 512);
  for (let y = 0; y < 512; y += 1) for (let x = 0; x < 1024; x += 1) field[y * 1024 + x] = x < 512 ? frontField[y * 512 + x] : plainField[y * 512 + x - 512];
  const inner = document.createElement("canvas");
  inner.width = inner.height = 256;
  const innerField = new Float32Array(256 * 256);
  paintConcrete(inner.getContext("2d"), 256, 256, innerField, { seed: 913, base: 0.82, tint: [1, 1, 0.99], speckles: 2600, pebbles: 100, blotches: 10 });
  const map = new THREE.CanvasTexture(atlas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const normalMap = new THREE.CanvasTexture(heightToNormal(field, 1024, 512, 2.6));
  const roughnessMap = new THREE.CanvasTexture(heightToRoughness(field, 1024, 512));
  const innerMap = new THREE.CanvasTexture(inner);
  innerMap.colorSpace = THREE.SRGBColorSpace;
  innerMap.wrapS = innerMap.wrapT = THREE.RepeatWrapping;
  const innerNormalMap = new THREE.CanvasTexture(heightToNormal(innerField, 256, 256, 2.8));
  innerNormalMap.wrapS = innerNormalMap.wrapT = THREE.RepeatWrapping;
  return {
    map,
    normalMap,
    roughnessMap,
    innerMap,
    innerNormalMap,
    dispose: createTextureDisposer([map, normalMap, roughnessMap, innerMap, innerNormalMap]),
  };
}

export function remapExtrudeUVsForAtlas(geometry, faceWidth, faceHeight) {
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const uv = geometry.attributes.uv;
  for (let index = 0; index < position.count; index += 1) {
    if (normal.getZ(index) > 0.72) {
      uv.setXY(index, THREE.MathUtils.clamp(position.getX(index) / faceWidth + 0.5, 0, 1) * 0.5, THREE.MathUtils.clamp(position.getY(index) / faceHeight + 0.5, 0, 1));
    } else {
      uv.setXY(index, 0.5 + Math.abs((position.getX(index) * 0.31) % 1) * 0.5, Math.abs((position.getY(index) * 0.31 + position.getZ(index) * 0.31) % 1));
    }
  }
  uv.needsUpdate = true;
}
