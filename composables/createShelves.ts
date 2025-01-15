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

  const shelfMaterial = createTexture("shelf_metal", 4, true, true, true, true);

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
