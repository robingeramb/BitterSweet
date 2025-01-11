import CANNON from "cannon";
import * as THREE from "three";

const productsGrid = [
  { x: -1, z: -1 },
  { x: 0, z: -1 },
  { x: 1, z: -1 },
  { x: -1, z: 0 },
  { x: 0, z: 0 },
  { x: 1, z: 0 },
  { x: -1, z: 1 },
  { x: 0, z: 1 },
  { x: 1, z: 1 },
];

let productGridCounter = 0;
const scaleAmount = 0.3;

export function clickEvent(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(shelves);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object; // Das angeklickte Objekt
    let topGroup = clickedObject;
    while (topGroup.parent && topGroup.parent != scene) {
      topGroup = topGroup.parent;
    }
    if (!selectMode.value) {
      selectMode.value = true;
      savedPos.x = camera.position.x;
      savedPos.y = camera.position.y;
      savedPos.z = camera.position.z;
      camera.position.z = topGroup.position.z;
      camera.position.y = 1.1;
      if (topGroup.position.x > 0) {
        camera.position.x = -1.2;
      } else {
        camera.position.x = 1.2;
      }

      camera.lookAt(
        topGroup.position.x,
        topGroup.position.y,
        topGroup.position.z
      );
    } else {
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

      // Füge das Shape zum Body hinzu
      boxBody.addShape(boxShape);

      // Füge den Body zur Welt hinzu
      world.addBody(boxBody);
      physicObjects.set(addedProduct, boxBody);
      addedProduct.translateX(0);
      addedProduct.translateY(0);
      addedProduct.translateZ(0);
      productGridCounter++;
      sugarCounter.value += clickedObject.userData.sugarAmount;
      productSelection.add(addedProduct);
      clickedObject.visible = false;
    }
    // Ändere die Farbe des Objekts
  }
}
