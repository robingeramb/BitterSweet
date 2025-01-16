import * as THREE from "three";
import { useProductsStore } from "~/stores/products";

export async function createProducts(
  shelfWidth: number,
  shelfLength: number,
  productList: Array<{ model?: string }>
): Promise<THREE.Group> {
  const dist = 0.1;
  const products = new THREE.Group();
  const myStore = useProductsStore();
  const productOrigin = myStore.products;
  // Berechnung der Breite eines Produkts
  const l =
    (shelfLength - dist * (productList.length + 1)) / productList.length;

  for (let index = 0; index < productList.length; index++) {
    const element = productOrigin[productList[index]];
    let dimensions;
    let product: THREE.Object3D;
    if (element.model) {
      // Lade das Modell asynchron
      let mdl = await loadModel(element.model);
      if (element.meshMode != false) {
        const mesh = mdl.isMesh
          ? mdl
          : (mdl.children.find((child) => child.isMesh) as THREE.Mesh);

        if (mesh && mesh.geometry) {
          // Berechne die BoundingBox und passe die Skalierung an
          product = mesh.clone();
          product.geometry.computeBoundingBox();
          dimensions = product.geometry.boundingBox!.getSize(
            new THREE.Vector3()
          );
          product.castShadow = true;
          product.receiveShadow = true;
          const scaleFactor = 0.35 / dimensions.y;
          product.scale.set(scaleFactor, scaleFactor, scaleFactor);

          // Übersetze das gesamte Produkt (nicht nur die Geometrie)
          product.position.set(index * (l + dist) + l / 2 + dist, 0, 0.1);
          product.rotation.y = Math.PI / 2;
        }
      } else {
        product = mdl;
        const boundingBox = new THREE.Box3().setFromObject(product);

        // Maße extrahieren
        dimensions = new THREE.Vector3();
        boundingBox.getSize(dimensions); // Gibt die Breite, Höhe und Tiefe zurück

        product.castShadow = true;
        product.receiveShadow = true;
        let scale = 0.35;
        if (element.scale) {
          scale = element.scale;
        }

        const scaleFactor = scale / dimensions.y;
        product.scale.set(scaleFactor, scaleFactor, scaleFactor);
        product.traverse((child) => {
          child.userData.productName = element.productName;
          child.userData.selectParent = true;
          child.castShadow = true;
          child.receiveShadow = true;
        });
        // Übersetze das gesamte Produkt (nicht nur die Geometrie)
        product.position.set(index * (l + dist) + l / 2 + dist, scale / 2, 0.1);

        if (element.rotation) {
          product.rotation.y = element.rotation;
        }
      }
    } else {
      // Erstelle ein einfaches Box-Produkt
      const color = getRandomColor(0x000000);
      const productMaterial = new THREE.MeshStandardMaterial({
        color: color,
      });
      const productGeometry = new THREE.BoxGeometry(l, 0.3, 0.3);
      //productGeometry.computeVertexNormals();
      productGeometry.translate(l / 2 + dist, 0.15, 0);
      product = new THREE.Mesh(productGeometry, productMaterial);

      product.position.set(index * (l + dist), 0, 0);
    }

    product.castShadow = true;
    product.receiveShadow = true;

    // Setze die Position und füge Daten hinzu
    product.userData = element;
    product.userData.finalLayer = true;
    product.userData.dimensions = dimensions;
    // Füge das Produkt der Gruppe hinzu
    products.add(product);
  }

  return products;
}
