import * as THREE from "three";

export function createShelve(height: number, length: number, width: number) {
  const shelve = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Regal-Material (Holzfarbe)

  const bottom = new THREE.BoxGeometry(length, height * 0.05, width * 0.95);
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(length, height * 0.05, width * 0.95);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    let board = new THREE.Mesh(geometry, material);
    board.position.set;
  }
  const bottom = new THREE.BoxGeometry(length, height * 0.05, width * 0.95);

  return shelve; // Die Gruppe zurückgeben
}
