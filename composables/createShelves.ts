export const shelves = [];
import {
  BoxGeometry,
  MeshStandardMaterial,
  RepeatWrapping,
  TextureLoader,
} from "three";

export async function createShelves(
  x: number,
  floorLength: number,
  shelfWidth: number,
  shelfLength: number,
  dist: number,
  shelfHeight: number
) {
  // shelf
  const shelfBaseColor = textureLoader.load(
    "/models/textures/22_Base_Color.jpeg"
  );
  const shelfNormalMap = textureLoader.load("/models/textures/22_Normal.jpeg");
  const shelfRoughnessMap = textureLoader.load(
    "/models/textures/22_Roughness.jpeg"
  );
  const shelfMetallicMap = textureLoader.load(
    "/models/textures/22_Metallic.jpeg"
  );

  const shelfRepeatFactor = 4; // Anzahl der Wiederholungen in X- und Y-Richtung
  shelfBaseColor.wrapS = RepeatWrapping; // Horizontale Wiederholung aktivieren
  shelfBaseColor.wrapT = RepeatWrapping; // Vertikale Wiederholung aktivieren
  shelfBaseColor.repeat.set(shelfRepeatFactor, shelfRepeatFactor); // Kachel-Wiederholungen setzen

  shelfNormalMap.wrapS = RepeatWrapping;
  shelfNormalMap.wrapT = RepeatWrapping;
  shelfNormalMap.repeat.set(shelfRepeatFactor, shelfRepeatFactor);

  shelfRoughnessMap.wrapS = RepeatWrapping;
  shelfRoughnessMap.wrapT = RepeatWrapping;
  shelfRoughnessMap.repeat.set(shelfRepeatFactor, shelfRepeatFactor);

  shelfMetallicMap.wrapS = RepeatWrapping;
  shelfMetallicMap.wrapT = RepeatWrapping;
  shelfMetallicMap.repeat.set(shelfRepeatFactor, shelfRepeatFactor);

  const shelfMaterial = new MeshStandardMaterial({
    map: shelfBaseColor,
    normalMap: shelfNormalMap,
    roughnessMap: shelfRoughnessMap,
    metalnessMap: shelfMetallicMap,
    //envMap: shoplight,
    //envMapIntensity: 0.5,
  });
  shelfMaterial.metalness = 1; // Maximale metallische Eigenschaft
  shelfMaterial.roughness = 1; // Mittlere Rauheit
  shelfMaterial.normalScale.set(1, 1); // Stärke der Normal Map

  for (let index = 0; index < floorLength / (shelfWidth + dist); index++) {
    const shelf = await createShelve(
      shelfHeight,
      shelfWidth,
      shelfLength,
      shelfMaterial
    );

    // Position des Regals berechnen
    shelf.position.x = x; // Regale entlang der X-Achse platzieren
    shelf.position.y = shelfHeight / 2 + 0.05; // Regale leicht über dem Boden positionieren
    shelf.position.z = -shelfWidth / 2 - index * (shelfLength + dist); // Z-Achse bleibt konstant (eine Linie)
    if (x < 0) {
      shelf.rotation.y = Math.PI / 2;
    } else {
      shelf.rotation.y = -Math.PI / 2;
    }

    shelf.castShadow = true;
    // Regal der Szene hinzufügen
    shelves.push(shelf);
    scene.add(shelf);
  }
}
