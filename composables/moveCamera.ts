import {
  useThree,
  shoppingCart,
  productSelection,
  currX,
  currY,
} from "@/composables/useThree";

export function useMoveCamera() {
  function moveCameraZ(z: number) {
    if (!selectMode.value) {
      camera.position.z = z;
      //shoppingCart.value.position.set(0.717, 0.07, camera.position.z + 1);
      camera.lookAt(currX.value, currY.value, camera.position.z - 4);
    }

    //_cubeCamera.position.z = _camera.position.z;
  }

  function moveCameraXY(x: number, y: number) {
    if (selectMode.value) {
      if (camera.position.x < 0) {
        currX.value = camera.position.z + (x / window.innerWidth - 0.5) * 0.3;
        currY.value = (y / window.innerHeight - 0.5) * -0.3 + 1.1;
        camera.lookAt(camera.position.x + 1.5, currY.value, currX.value);
      } else {
        currX.value = camera.position.z - (x / window.innerWidth - 0.5) * 0.3;
        currY.value = (y / window.innerHeight - 0.5) * -0.3 + 1.1;
        camera.lookAt(camera.position.x - 1.5, currY.value, currX.value);
      }
    } else {
      currX.value = (x / window.innerWidth - 0.5) * 8;
      currY.value = (y / window.innerHeight - 0.5) * -8;
      camera.lookAt(currX.value, currY.value, camera.position.z - 4);
    }
  }
  return {
    moveCameraZ,
    moveCameraXY,
  };
}
