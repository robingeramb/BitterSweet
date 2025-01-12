export const deleteObjekt = (obj) => {
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    // Falls das Material ein Array ist (bei MultiMaterial), iteriere darüber
    if (Array.isArray(obj.material)) {
      obj.material.forEach((material) => material.dispose());
    } else {
      obj.material.dispose();
    }
  }
  if (obj.children.length > 0) {
    obj.children.forEach((child) => disposeObject(child));
  }
  scene.remove(obj);
};
