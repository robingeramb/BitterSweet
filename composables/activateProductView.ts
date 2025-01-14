export const activateProductView = (clickedObject) => {
  clickedObject.position.set(0, 1.1, camera.position.z);

  spotLight.intensity = 4;
  spotLight.position.set(camera.position.x, 1.1, camera.position.z);
  spotLight.target = clickedObject; // Das Ziel ist das Objekt, das beleuchtet werden soll

  if (camera.position.x > 0) {
    clickedObject.rotation.y = Math.PI;
  } else {
    clickedObject.rotation.y = (8 * Math.PI) / 4;
  }
  scene.add(clickedObject);
};
