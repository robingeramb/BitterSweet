import * as THREE from "three";
import { useProductsStore } from "~/stores/products";

export async function createShelve(
  height: number,
  length: number,
  width: number
) {
  const shelf = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x454545 }); // Regal-Material (Holzfarbe)
  const bottomMaterial = new THREE.MeshStandardMaterial({ color: 0xfffeee });
  const bottom = new THREE.BoxGeometry(length, height * 0.05, width * 0.9);

  const bottomMesh = new THREE.Mesh(bottom, bottomMaterial);
  bottomMesh.castShadow = true;
  bottomMesh.receiveShadow = true;
  bottomMesh.position.set(0, -height / 2 + height * 0.025, 0);
  const myStore = useProductsStore();
  const productList = myStore.products;
  for (let i = 0; i < 4; i++) {
    const productBoard = new THREE.Group();
    const geometry = new THREE.BoxGeometry(
      length,
      height * 0.025,
      width * 0.95
    );
    const material = new THREE.MeshStandardMaterial({ color: 0x454545 });
    let board = new THREE.Mesh(geometry, material);
    board.castShadow = true;
    board.receiveShadow = true;

    const products = await createProducts(width, length, productList);
    products.translateY(height * 0.0125);
    products.translateX(-0.5 * length);
    productBoard.add(products);
    productBoard.add(board);
    productBoard.castShadow = true;
    productBoard.receiveShadow = true;
    productBoard.position.set(
      0,
      -height / 2 + height * 0.0625 + i * ((height * 0.95) / 4),
      0.0125
    );
    shelf.add(productBoard);
  }
  const back = new THREE.BoxGeometry(length, height, width * 0.05);
  const backMesh = new THREE.Mesh(back, material);
  backMesh.position.set(0, 0, -width / 2 + width * 0.025);
  backMesh.castShadow = true;
  backMesh.receiveShadow = true;

  shelf.add(bottomMesh);
  shelf.add(backMesh);
  return shelf; // Die Gruppe zurückgeben
}
