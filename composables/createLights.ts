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
    const glassGeometry = new THREE.BoxGeometry(0.7, 0.1, 2);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // Basisfarbe des Glases
      roughness: 0.1, // Rauheit (0 = glatt, 1 = rau)
      transmission: 1.0, // Lichtdurchlässigkeit (1.0 = komplett durchsichtig)
      thickness: 0.5, // Dicke des Glases für Lichtbrechungseffekte
      envMapIntensity: 1.0, // Intensität der Umgebungsreflektion
      clearcoat: 1.0, // Zusätzliche Glanzschicht
      clearcoatRoughness: 0.0, // Rauheit der Glanzschicht
      opacity: 0.1, // Transparenzkontrolle (kombiniert mit `transmission`)
      side: THREE.DoubleSide, // Sichtbarkeit von Vorder- und Rückseite
      metalness: 0.0, // Metallischer Effekt (für Glas normalerweise 0)
    });
    const glassContainer = new THREE.Mesh(glassGeometry, glassMaterial);
    glassContainer.position.set(0, 0.05, 0);
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

    //spotLight.position.set(0, 3, -1 * (index * ((shelfLength + dist) * 2)));
    /*spotLight.target.position.set(
      0,
      0,
      -1 * (index * (shelfLength + dist) * 2)
    ); // Ensure light points at the center*/
    lightGroup.add(spotLight);
    //lightGroup.add(glassContainer);
    //lightGroup.add(rectAreaLight);
    lights.add(lightGroup);
  }
  return lights;
}
