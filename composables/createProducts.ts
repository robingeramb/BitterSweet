import * as THREE from "three";

export function createProducts(
  shelfWidth: number,
  shelfLength: number,
  productList: Array<Object>
) {
  const dist = 0.1;
  const products = new THREE.Group();

  for (let index = 0; index < productList.length; index++) {
    const color = getRandomColor(0x000000);
    const productMaterial = new THREE.MeshStandardMaterial({
      color: color,
    });
    const l =
      (shelfLength - dist * (productList.length + 1)) / productList.length;
    const productGeometry = new THREE.BoxGeometry(l, 0.3, 0.3);
    productGeometry.translate(l / 2 + dist, 0.15, 0);
    const product = new THREE.Mesh(productGeometry, productMaterial);
    product.castShadow = true;
    product.receiveShadow = true;
    product.position.set(index * (l + dist), 0, 0);
    product.userData = productList[index];
    products.add(product);
  }
  return products;
}
