export const activateProductView = (clickedObject) => {
  clickedObject.position.set(0, 1.1, camera.position.z);
  scene.add(clickedObject);
};
