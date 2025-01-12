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

const scaleAmount = 0.3;
let productView = false;
let selectedProduct = null;
let isDragging = false;
let clickedObject;
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let previousMousePosition = { x: 0, y: 0 };

export function clickEvent(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let intersects;
  if (productView) {
    intersects = raycaster.intersectObjects([selectedProduct]);
  } else {
    intersects = raycaster.intersectObjects(shelves);
  }

  if (intersects.length > 0) {
    clickedObject = intersects[0].object; // Das angeklickte Objekt
    let topGroup = clickedObject;
    while (topGroup.parent && topGroup.parent !== scene) {
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
      if (productView == false) {
        productView = true;
        selectedProduct = clickedObject.clone();
        clickedObject.visible = false;
        selectedProduct.geometry.center();
        activateProductView(selectedProduct);
        addRotationControls();
      } else if (productView) {
        console.log(clickedObject.userData);
        if (clickedObject == selectedProduct) {
          console.log("fitting");
        }
      }
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
  window.removeEventListener("mousedown", onMouseDown);
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove);
}

function onMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let intersects;
  if (productView) {
    intersects = raycaster.intersectObjects([selectedProduct]);
  } else {
    intersects = raycaster.intersectObjects(shelves);
  }
  if (intersects.length > 0) {
    clickedObject = intersects[0].object;
  }
  if (clickedObject == selectedProduct) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  }
}

function onMouseUp() {
  clickedObject = null;
  isDragging = false;
}

function onMouseMove(event) {
  if (!isDragging || !selectedProduct) return;

  const deltaX = event.clientX - previousMousePosition.x;

  // Rotation um den eigenen Mittelpunkt (nur Y-Achse)
  selectedProduct.rotation.y += deltaX * 0.01;

  previousMousePosition = { x: event.clientX, y: event.clientY };
}
