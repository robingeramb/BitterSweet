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

const scaleAmount = 0.5;
export let productView = ref(false);
export let selectedProduct = ref();
export let hoveredProduct = ref();
let isDragging = false;
let clickedObject;
export const hoveredMouseX = ref();
export const hoveredMouseY = ref();
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let previousMousePosition = { x: 0, y: 0 };

export function clickEvent(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let intersects;
  if (productView.value) {
    intersects = raycaster.intersectObjects([selectedProduct]);
  } else {
    intersects = raycaster.intersectObjects(shelves);
  }

  if (intersects.length > 0) {
    if (productView.value === false) {
      clickedObject = intersects[0].object;
    }
    let topGroup = clickedObject;
    while (topGroup.parent && topGroup.parent !== scene) {
      topGroup = topGroup.parent;
    }

    if (!selectMode.value) {
      selectMode.value = true;
      productHover();
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
      if (productView.value === false) {
        productView.value = true;

        while (
          clickedObject.parent &&
          clickedObject.parent !== scene &&
          clickedObject.userData.finalLayer != true
        ) {
          clickedObject = clickedObject.parent;
        }
        selectedProduct = clickedObject.clone();
        if (selectedProduct.isMesh) {
          selectedProduct.geometry = clickedObject.geometry.clone();
          selectedProduct.geometry.center();
        }

        selectedProduct.scale.copy(clickedObject.scale);
        clickedObject.visible = false;

        activateProductView(selectedProduct);
        addRotationControls();
      } else if (productView.value) {
        if (clickedObject == selectedProduct) {
          console.log("fitting");
        }
      }
    }
  }
}

export function productHover() {
  window.addEventListener("mousemove", checkOverProduct);
}

export function selectedProductToCart() {
  removeRotationControls();
  if (selectedProduct) {
    useAddProductToCart(selectedProduct, scaleAmount);
    setTimeout(() => {
      productView.value = false;
    }, 200);
  }
}

export function selectedProductToShelf() {
  removeRotationControls();
  spotLight.intensity = 0;
  if (selectedProduct) {
    clickedObject.visible = true;
    deleteObjekt(selectedProduct);
    setTimeout(() => {
      productView.value = false;
    }, 200);
  }
}

function checkOverProduct(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  hoveredMouseX.value = event.clientX;
  hoveredMouseY.value = event.clientY;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(shelves);
  if (intersects.length > 0) {
    let hoveredObject = intersects[0].object;
    if (
      hoveredObject.userData &&
      hoveredObject.userData.productName != undefined
    ) {
      hoveredProduct.value = hoveredObject.userData.productName;
    } else {
      hoveredProduct.value = undefined;
    }
  }
}

// Funktion zur Steuerung der Rotation hinzufügen
function addRotationControls() {
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
}

function removeRotationControls() {
  //window.removeEventListener("mousemove", checkOverProduct);
  window.removeEventListener("mousedown", onMouseDown);
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove);
}

function onMouseDown(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  let mouseDownObj: THREE.Mesh;
  raycaster.setFromCamera(mouse, camera);
  let intersects;
  if (productView.value) {
    if (selectedProduct.isMesh) {
      intersects = raycaster.intersectObjects([selectedProduct]);
    } else {
      intersects = raycaster.intersectObjects(selectedProduct.children);
    }
  } else {
    intersects = raycaster.intersectObjects(shelves);
  }
  if (intersects.length > 0 && !productView.value) {
    mouseDownObj = intersects[0].object;
  }
  if (
    (mouseDownObj == selectedProduct || intersects.length > 0) &&
    productView.value
  ) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  }
}

function onMouseUp() {
  isDragging = false;
}

function onMouseMove(event: MouseEvent) {
  if (!isDragging || !selectedProduct) return;

  const deltaX = event.clientX - previousMousePosition.x;

  // Rotation um den eigenen Mittelpunkt (nur Y-Achse)
  selectedProduct.rotation.y += deltaX * 0.01;

  previousMousePosition = { x: event.clientX, y: event.clientY };
}
