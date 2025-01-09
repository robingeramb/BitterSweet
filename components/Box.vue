<script setup lang="ts">
import { useThree } from "@/composables/useThree";
import {
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  CubeTextureLoader,
  AmbientLight,
  DirectionalLight,
  Scene,
  Group,
  CubeCamera,
  WebGLRenderer,
  RectAreaLight,
  Raycaster,
  Vector2,
  Box3,
  Vector3,
  WebGLCubeRenderTarget,
  LinearMipmapLinearFilter,
} from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const props = defineProps({
  mousePos: {
    type: Object,
    required: true,
  },
  scrollVal: {
    type: Number,
    required: true,
  },
});

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

const shelves = [];
const cubeCameras = [];

watch(
  () => props.scrollVal,
  (newValue, oldValue) => {
    moveCameraZ(newValue);
  }
);
watch(
  () => [props.mousePos.x, props.mousePos.y],
  ([newX, newY], [oldX, oldY]) => {
    moveCameraXY(newX, newY);
  }
);

let _scene: Scene;
let _cubeRenderTarget: WebGLCubeRenderTarget;
let _camera: PerspectiveCamera;
let _renderer: WebGLRenderer;
let _cubeCamera: CubeCamera;
let _renderLoopId: number;

const sugarCounter = ref();
sugarCounter.value = 0;

let _floor: Mesh;
let _roof: Mesh;

let shoppingCart = null;
let shelfModel = null;

let currX;
let currY;

let selectMode = false;
let savedPos = null;

const productSelection = new Group();

const raycaster = new Raycaster();
const mouse = new Vector2();

const floorLength = 150; // Gesamtlänge des Bodens
const shelfLength = 0.5; // Länge eines Regals
const shelfHeight = 2; // Höhe eines Regals
const shelfWidth = 2.5; // Breite eines Regals
const dist = 2.2; // Abstand zwischen Regalen

const { initThree, cleanUpThree } = useThree();
const canvas = computed(
  () => document.getElementById("mountId") as HTMLCanvasElement
);

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, _camera);
  const intersects = raycaster.intersectObjects(shelves);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object; // Das angeklickte Objekt
    let topGroup = clickedObject;
    while (topGroup.parent && topGroup.parent != _scene) {
      topGroup = topGroup.parent;
    }
    if (!selectMode) {
      selectMode = true;
      savedPos = _camera.position.clone();
      console.log("xx");
      console.log(savedPos);
      console.log("xx");
      _camera.position.z = topGroup.position.z;
      _camera.position.y = 1.2;
      if (topGroup.position.x > 0) {
        _camera.position.x = -1.5;
      } else {
        _camera.position.x = 1.5;
      }

      _camera.lookAt(
        topGroup.position.x,
        topGroup.position.y,
        topGroup.position.z
      );
    } else {
      let addedProduct = clickedObject.clone();
      addedProduct.scale.set(0.3, 0.3, 0.3);
      addedProduct.position.set(
        productsGrid[productGridCounter].x * 0.12,
        0,
        productsGrid[productGridCounter].z * 0.12
      );
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

function animateObject() {
  //rotate object
}

function moveCameraZ(z) {
  if (!selectMode) {
    _camera.position.z = z;
    shoppingCart.position.set(0.717, 0.07, _camera.position.z + 1);
    productSelection.position.set(-0.1, 0.5, _camera.position.z - 1);
    _camera.lookAt(currX, currY, _camera.position.z - 4);
  }

  //_cubeCamera.position.z = _camera.position.z;
}

function moveCameraXY(x, y) {
  if (selectMode) {
    if (_camera.position.x < 0) {
      currX = _camera.position.z + (x / window.innerWidth - 0.5) * 0.3;
      currY = (y / window.innerHeight - 0.5) * -0.3 + 1.2;
      _camera.lookAt(_camera.position.x + 1.5, currY, currX);
    } else {
      currX = _camera.position.z - (x / window.innerWidth - 0.5) * 0.3;
      currY = (y / window.innerHeight - 0.5) * -0.3 + 1.2;
      _camera.lookAt(_camera.position.x - 1.5, currY, currX);
    }
  } else {
    currX = (x / window.innerWidth - 0.5) * 8;
    currY = (y / window.innerHeight - 0.5) * -8;
    _camera.lookAt(currX, currY, _camera.position.z - 4);
  }
}

function renderLoop() {
  _cubeCamera.position.copy(_camera.position);
  _cubeCamera.update(_renderer, _scene);
  _renderer.render(_scene, _camera);
  animateObject();
  _renderLoopId = requestAnimationFrame(renderLoop);
}

function createShelves(scene: Scene, x) {
  for (let index = 0; index < floorLength / (shelfWidth + dist); index++) {
    const shelf = createShelve(shelfHeight, shelfWidth, shelfLength);

    // Position des Regals berechnen
    shelf.position.x = x; // Regale entlang der X-Achse platzieren
    shelf.position.y = shelfHeight / 2 + 0.1; // Regale leicht über dem Boden positionieren
    shelf.position.z = -1 * (index * (shelfLength + dist)); // Z-Achse bleibt konstant (eine Linie)
    if (x < 0) {
      shelf.rotation.y = Math.PI / 2;
    } else {
      shelf.rotation.y = -Math.PI / 2;
    }

    shelf.castShadow = true;
    // Regal der Szene hinzufügen
    shelves.push(shelf);
    _scene.add(shelf);
  }
}

function leaveSelectMode() {
  if (selectMode) {
    console.log(savedPos);
    _camera.position.set(savedPos.x, savedPos.y, savedPos.z);
    _camera.lookAt(0, 0, _camera.position.z - 4);

    selectMode = false;
  }
}

function createCubeCamera() {
  // CubeCamera für Reflexionen
  _cubeRenderTarget = new WebGLCubeRenderTarget(128, {
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
  });

  // Create cube camera
  _cubeCamera = new CubeCamera(1, 100000, _cubeRenderTarget);
}

function setupScene() {
  //initialize
  const { scene, camera, renderer } = initThree("mountId");
  _scene = scene;
  _camera = camera;
  _camera.aspect = window.innerWidth / window.innerHeight; // Neues Seitenverhältnis
  _camera.updateProjectionMatrix();
  _renderer = renderer;
  createCubeCamera();
  const floor = new BoxGeometry(10, 0.1, floorLength);
  const floorMaterial = new MeshStandardMaterial({
    color: 0xffffff, // Farbe des Bodens
    roughness: 0.1, // Sehr wenig Rauheit für eine spiegelglatte Oberfläche
    metalness: 0.3, // Maximale Metallizität für Reflexionen
    envMap: _cubeRenderTarget.texture,
    envMapIntensity: 1,
  });

  loader.load(
    "/models/altspace_blue_shopping_cart.glb", // Pfad zum GLB-Modell
    (gltf) => {
      shoppingCart = gltf.scene;

      shoppingCart.scale.set(0.02, 0.02, 0.02);
      shoppingCart.position.set(0.717, 0.07, 5);
      shoppingCart.rotation.y = Math.PI / 2;
      shoppingCart.castShadow = true;
      shoppingCart.receiveShadow = true;
      // Das geladene Modell wird im `gltf.scene`-Objekt enthalten sein
      _scene.add(shoppingCart);
    },
    (xhr) => {
      // Fortschrittsanzeige (optional)
      //console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      // Fehlerbehandlung
      console.error("An error occurred:", error);
    }
  );

  const testProductGeometry = new BoxGeometry(0.1, 0.1, 0.1);
  const testProductrMaterial = new MeshStandardMaterial({
    color: 0xfff000, // Farbe des Bodens
  });

  const testProduct = new Mesh(testProductGeometry, testProductrMaterial);

  //productSelection.add(testProduct);
  _scene.add(productSelection);
  productSelection.position.set(0, 0.5, 3);

  _floor = new Mesh(floor, floorMaterial);
  _floor.position.set(0, 0, 4 + -floorLength / 2);
  _floor.receiveShadow = true;
  _scene.add(_floor);

  const roof = new BoxGeometry(10, 0.1, floorLength);
  const roofMaterial = new MeshStandardMaterial({
    color: 0xeeefee, // Farbe des Bodens
    roughness: 0.5, // Sehr wenig Rauheit für eine spiegelglatte Oberfläche
    metalness: 0.5, // Maximale Metallizität für Reflexionen
  });

  _roof = new Mesh(roof, roofMaterial);
  _roof.position.set(0, 3.1, 4 + -floorLength / 2);
  _scene.add(_roof);

  createShelves(_scene, -1.6);
  createShelves(_scene, 1.6);
  const lights = createLights(floorLength, shelfWidth, shelfLength, dist);
  _scene.add(lights);

  // start the renderLoop
  _renderLoopId = requestAnimationFrame(renderLoop);
}
const loader = new GLTFLoader();

onMounted(() => {
  if (canvas.value) {
    // Canvas-Größe dynamisch setzen
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    window.addEventListener("click", onClick);
    setupScene();
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(_renderLoopId);
  cleanUpThree(_scene, _renderer);
});

defineExpose({ leaveSelectMode });
</script>

<template>
  <canvas id="mountId" width="700" height="500" />
  <div class="fixed top-2 right-2 text-white font-semibold text-4xl">
    <p v-html="sugarCounter"></p>
  </div>
</template>
