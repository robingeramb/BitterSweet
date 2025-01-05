import type {
  BufferGeometry,
  Material,
  Texture,
  Mesh,
  Group,
  Object3D,
} from "three";

export function disposeObject(object: Group | Object3D) {
  if (!object) return;
  const geometries = new Map<string, BufferGeometry>();
  const materials = new Map<string, Material>();
  const textures = new Map<string, Texture>();

  object.traverse((object) => {
    const mesh = object as Mesh;
    if (mesh.isMesh) {
      const geometry = mesh.geometry as BufferGeometry;
      if (geometry) {
        geometries.set(geometry.uuid, geometry);
      }
      const material = mesh.material as any;
      if (material) {
        materials.set(material.uuid, material);
        for (const key in material) {
          const texture = material[key];
          if (texture && texture.isTexture) {
            textures.set(texture.uuid, texture);
          }
        }
      }
    }
  });

  for (const entry of textures) {
    entry[1].dispose();
  }
  for (const entry of materials) {
    entry[1].dispose();
  }
  for (const entry of geometries) {
    entry[1].dispose();
  }
}
