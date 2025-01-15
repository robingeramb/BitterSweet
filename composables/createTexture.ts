import {
  RepeatWrapping,
  LinearMipMapLinearFilter,
  MeshStandardMaterial,
  Texture,
} from "three";

const textures: Record<string, Record<string, Texture>> = {};

export const createTexture = (
  name: string,
  repeat: number = 1,
  basecolor: boolean = false,
  normalMap: boolean = false,
  roughnessMap: boolean = false,
  metallicMap: boolean = false,
  heightMap: boolean = false,
  metalness: number = 1,
  roughness: number = 1,
  normal: number = 1,
  displacementScale: number = 1
): MeshStandardMaterial => {
  const readyMaterial = new MeshStandardMaterial({
    metalness,
    roughness,
    displacementScale,
  });

  // Helper to load and cache textures
  function loadAndCacheTexture(type: string): Texture {
    if (!textures[name]) {
      textures[name] = {};
    }

    if (!textures[name][type]) {
      textures[name][type] = textureLoader.load(
        `/models/textures/${name}/${type}.webp`
      );
      setRepeat(textures[name][type]);
    }

    return textures[name][type];
  }

  // Apply repeat settings to textures
  function setRepeat(texture: Texture): void {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeat, repeat);
  }

  // Conditionally load textures and assign them to the material
  if (basecolor) {
    readyMaterial.map = loadAndCacheTexture("baseColor");
  }
  if (normalMap) {
    readyMaterial.normalMap = loadAndCacheTexture("normal");
    readyMaterial.normalScale.set(normal, normal);
  }
  if (roughnessMap) {
    readyMaterial.roughnessMap = loadAndCacheTexture("roughness");
  }
  if (metallicMap) {
    readyMaterial.metalnessMap = loadAndCacheTexture("metallic");
  }
  if (heightMap) {
    readyMaterial.displacementMap = loadAndCacheTexture("height");
  }

  readyMaterial.generateMipmaps = true;
  readyMaterial.minFilter = LinearMipMapLinearFilter;

  return readyMaterial;
};
