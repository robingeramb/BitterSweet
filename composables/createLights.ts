import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export function createLights(
  floorLength: number,
  shelfWidth: number,
  shelfLength: number,
  dist: number
) {
  const lights = new THREE.Group();
  for (
    let index = 0;
    index < floorLength / ((shelfWidth + dist) * 2);
    index++
  ) {
    const rectAreaLight = new THREE.RectAreaLight(0xffffff, 4, 0.7, 2);
    rectAreaLight.position.set(0, 3, -1 * (index * ((shelfLength + dist) * 2)));
    rectAreaLight.lookAt(0, 0, -1 * (index * (shelfLength + dist) * 2)); // Ensure light points at the center

    const rectLightHelper = new RectAreaLightHelper(rectAreaLight); // Helper to visualize the light
    rectAreaLight.add(rectLightHelper);

    lights.add(rectAreaLight);
  }
  return lights;
}
