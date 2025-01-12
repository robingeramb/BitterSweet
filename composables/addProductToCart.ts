import CANNON from "cannon";
import * as THREE from "three";

export const useAddProductToCart = (clickedObject, scaleAmount: number) => {
  let addedProduct = clickedObject.clone();
  addedProduct.scale.set(scaleAmount, scaleAmount, scaleAmount);
  addedProduct.geometry.computeBoundingBox();
  const dimensions = addedProduct.geometry.boundingBox.getSize(
    new THREE.Vector3()
  );
  console.log(dimensions);
  addedProduct.position.set(0, 2, 0);

  const boxShape = new CANNON.Box(
    new CANNON.Vec3(
      (dimensions.x * scaleAmount) / 2,
      (dimensions.y * scaleAmount) / 2,
      (dimensions.z * scaleAmount) / 2
    )
  ); // Rechteckige Box (2x1x0.5)

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
  deleteObjekt(clickedObject);

  // Aufgabe erfüllt
  addedProductsInCart.value++; 
  if(addedProductsInCart.value >= 5) {
    taskDone.value = true;
  } 

  return ref();
};
