export const activateProductView = (clickedObject) => {
  clickedObject.position.set(0, 1.1, camera.position.z);

  spotLight.intensity = 4;

  spotLight.target = clickedObject; // Das Ziel ist das Objekt, das beleuchtet werden soll
  if (clickedObject.isMesh) {
    if (camera.position.x > 0) {
      clickedObject.rotation.y = Math.PI;
      spotLight.position.set(1, 1.1, camera.position.z);
    } else {
      clickedObject.rotation.y = (8 * Math.PI) / 4;
      spotLight.position.set(-1, 1.1, camera.position.z);
    }
  } else if (camera.position.x > 0) {
    clickedObject.rotation.y = -(6 * Math.PI) / 4;
    spotLight.position.set(1, 1.1, camera.position.z);
  } else {
    clickedObject.rotation.y = (6 * Math.PI) / 4;
    spotLight.position.set(-1, 1.1, camera.position.z);
  }

  scene.add(clickedObject);
};
