import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export async function createLights(
  floorLength: number,
  shelfWidth: number,
  shelfLength: number,
  dist: number
) {
  const lights = new THREE.Group();
  const lightModel = await loadModel("supermarket_lamp.glb");
  const stencilGeometry = new THREE.SphereGeometry(0.16, 32, 32);
  const stencilMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xfff000),
    colorWrite: true, // Das Modell selbst wird nicht sichtbar
    depthWrite: false, // Kein Tiefenpuffer schreiben
    stencilWrite: true, // Schreiboperation für den Stencil Buffer
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilRef: 1,
    stencilFail: THREE.KeepStencilOp,
    stencilZFail: THREE.KeepStencilOp,
    stencilZPass: THREE.ReplaceStencilOp,
  });
  const stencil = new THREE.Mesh(stencilGeometry, stencilMaterial);

  for (
    let index = 0;
    index < floorLength / ((shelfWidth + dist) * 2);
    index++
  ) {
    const light = lightModel.clone();
    const lightGroup = new THREE.Group();
    const rectAreaLight = new THREE.RectAreaLight(0xffffff, 1, 0.7, 2);
    lightGroup.position.set(0, 3, -1 * (index * ((shelfLength + dist) * 2)));
    rectAreaLight.rotateX(-Math.PI / 2); // Ensure light points at the center

    const rectLightHelper = new RectAreaLightHelper(rectAreaLight); // Helper to visualize the light
    rectAreaLight.add(rectLightHelper);
    const spotLight = new THREE.PointLight(0xffffff, 16, 20);

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048; // Höhere Auflösung für schärfere Schatten
    spotLight.shadow.mapSize.height = 2048;

    light.position.set(0, -0.05, 0);
    light.scale.set(2, 2, 2);

    lightGroup.add(spotLight);
    const stencil2 = stencil.clone();
    stencil2.position.set(0, 0.1, 0);
    lightGroup.add(stencil2);
    lightGroup.add(light);
    //lightGroup.add(glassContainer);
    //lightGroup.add(rectAreaLight);
    lights.add(lightGroup);
  }
  return lights;
}
