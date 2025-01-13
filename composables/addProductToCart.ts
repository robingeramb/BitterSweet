import CANNON from "cannon";
import * as THREE from "three";

export const useAddProductToCart = (clickedObject, scaleAmount: number) => {
  let addedProduct = clickedObject.clone();
  let s = clickedObject.scale.x;
  addedProduct.scale.set(scaleAmount * s, scaleAmount * s, scaleAmount * s);
  addedProduct.geometry.computeBoundingBox();
  const dimensions = addedProduct.geometry.boundingBox.getSize(
    new THREE.Vector3()
  );
  console.log(dimensions);
  addedProduct.position.set(0, 2, 0);

  const boxShape = new CANNON.Box(
    new CANNON.Vec3(
      (dimensions.x * scaleAmount * s) / 2,
      (dimensions.y * scaleAmount * s) / 2,
      (dimensions.z * scaleAmount * s) / 2
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
  productsInCart.add(clickedObject);
  productsInCart.children.forEach((child) => {
    console.log(child);  // Zeigt die Objekte in der Konsole an
  });


  // Aufgabe erfüllt

  const targetNames = ['Penne Rigatte Nudeln', 'Tomatensauce'];

  const nameCount = productsInCart.children.reduce((count, child) => {
    if (targetNames.includes(child.userData.name)) {
      count++;
    }
    return count;
  }, 0);
  
  if (nameCount >= 2) {
    taskDone.value = true;
  }

  return ref();
};
