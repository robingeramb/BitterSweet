import CANNON from "cannon";
import * as THREE from "three";

export const useAddProductToCart = (clickedObject, scaleAmount: number) => {
  let addedProduct = clickedObject.clone();
  let s = clickedObject.scale.x;
  let boxShape;
  addedProduct.scale.set(scaleAmount * s, scaleAmount * s, scaleAmount * s);
  let dimensions;
  if (addedProduct.isMesh) {
    addedProduct.geometry.computeBoundingBox();
    dimensions = addedProduct.geometry.boundingBox.getSize(new THREE.Vector3());
    boxShape = new CANNON.Box(
      new CANNON.Vec3(
        (dimensions.x * scaleAmount * s) / 2,
        (dimensions.y * scaleAmount * s) / 2,
        (dimensions.z * scaleAmount * s) / 2
      )
    ); // Rechteckige Box (2x1x0.5)
  } else {
    const boundingBox = new THREE.Box3().setFromObject(clickedObject);

    // Maße extrahieren
    dimensions = new THREE.Vector3();
    boundingBox.getSize(dimensions); // Gibt die Breite, Höhe und Tiefe zurüc
    boxShape = new CANNON.Box(
      new CANNON.Vec3(
        (dimensions.x * scaleAmount) / 2,
        (dimensions.y * scaleAmount) / 2,
        (dimensions.z * scaleAmount) / 2
      )
    ); // Rechteckige Box (2x1x0.5)
  }

  addedProduct.position.set(0, 2, 0);

  // Erstelle ein physikalisches Objekt (Body)
  const boxBody = new CANNON.Body({
    mass: 1, // Die Masse des Körpers
    linearDamping: 0.3, // Reduziert lineare Geschwindigkeit
    angularDamping: 0.3, // Reduziert Rotation
    position: new CANNON.Vec3(0, 2, 0), // Anfangsposition (x, y, z)
  });
  boxBody.sleepSpeedLimit = 0.1;
  boxBody.collisionResponse = true; // Standardmäßig aktiviert
  //boxBody.allowSleep = false; // Verhindert das "Einschlafen" des Objekts
  boxBody.linearDamping = 0.1; // Reduziert Gleitbewegungen
  boxBody.angularDamping = 0.1; // Reduziert Rotationsbewegungen
  boxBody.ccdSpeedThreshold = 0.1; // Aktiviert CCD bei hoher Geschwindigkeit
  boxBody.ccdIterations = 10; // Anzahl der Iterationen für CCD

  // Füge das Shape zum Body hinzu
  boxBody.addShape(boxShape);

  // Füge den Body zur Welt hinzu
  world.addBody(boxBody);
  physicObjects.set(addedProduct, boxBody);
  addedProduct.translateX(0);
  addedProduct.translateY(0);

  addedProduct.translateZ(0);

  sugarCounter.value += clickedObject.userData.sugarAmount;
  productSelection.add(addedProduct);
  productsInCart.push(clickedObject.userData);
  deleteObjekt(clickedObject);

  // Aufgabe erfüllt

  const targetCategories = [
    "noodles",
    "tomatosauce",
    "fertig",
    "drinks",
    "snacks",
  ];
  let drinksCount = 0;

  productsInCart.forEach((element) => {
    if (targetCategories.includes(element.category)) {
      if (element.category == "noodles") {
        noodelsCheck.value = true;
      } else if (element.category == "tomatosauce") {
        sauceCheck.value = true;
      } else if (element.category == "fertig") {
        sauceCheck.value = true;
        noodelsCheck.value = true;
      } else if (element.category == "snacks") {
        snacksCheck.value = true;
      } else if (element.category == "drinks") {
        drinksCount++;
      }
    }
  });

  if (drinksCount >= 3) {
    drinksCheck.value = true;
  }

  if (
    noodelsCheck.value &&
    sauceCheck.value &&
    drinksCheck.value &&
    snacksCheck.value
  ) {
    taskDone.value = true;
  }

  return ref();
};
