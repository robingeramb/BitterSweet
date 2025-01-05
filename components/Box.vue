<script setup lang="ts">
import { useThree } from "@/composables/useThree";
import {
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
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

const shelves = [];

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
let _box: Mesh;
let _floor: Mesh;
let _roof: Mesh;

let shoppingCart = null;
let shelfModel = null;

let currX;
let currY;

const raycaster = new Raycaster();
const mouse = new Vector2();

const floorLength = 200; // Gesamtlänge des Bodens
const shelfLength = 0.5; // Länge eines Regals
const shelfHeight = 2; // Höhe eines Regals
const shelfWidth = 3; // Breite eines Regals
const dist = 2.7; // Abstand zwischen Regalen

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
    console.log("Clicked object:", clickedObject);

    _camera.position.z = clickedObject.position.z;
    _camera.position.x = -2.1;
    _camera.lookAt(
      clickedObject.position.x,
      clickedObject.position.y,
      clickedObject.position.z
    );
    clickedObject.material.color.set(0x0000ff); // Ändere die Farbe des Objekts
  }
}

function animateObject() {
  //rotate object

  _box.rotation.x += 0.01;
  _box.rotation.y += 0.01;
}

function moveCameraZ(z) {
  _camera.position.z = z;
  shoppingCart.position.set(0.7, 0.07, _camera.position.z + 1);
  _camera.lookAt(currX, currY, _camera.position.z - 4);

  _cubeCamera.position.z = _camera.position.z;
}

function moveCameraXY(x, y) {
  currX = (x / window.innerWidth - 0.5) * 8;
  currY = (y / window.innerHeight - 0.5) * -8;

  _camera.lookAt(currX, currY, _camera.position.z - 4);

  _cubeCamera.position.z = _camera.position.z;
}

function renderLoop() {
  // will keep running for every frame since
  // we keep recreate a new requestAnimationFrame at the end of the function.

  _cubeCamera.update(_renderer, _scene);
  _renderer.render(_scene, _camera);
  animateObject();
  _renderLoopId = requestAnimationFrame(renderLoop);
}

function createShelves(scene: Scene, x) {
  loader.load(
    "/models/shelf.glb", // Pfad zum GLB-Modell
    (gltf) => {
      shelfModel = gltf.scene;
      const shelfBorderBox = new Box3().setFromObject(shelfModel);
      const shelfSize = new Vector3();
      shelfBorderBox.getSize(shelfSize); // size enthält die Dimensionen: { x: Breite, y: Höhe, z: Tiefe }

      const scale = shelfWidth / shelfSize.x;

      for (let index = 0; index < floorLength / (shelfWidth + dist); index++) {
        const newShelf = shelfModel.clone();
        newShelf.scale.set(scale, scale, scale);
        newShelf.position.x = x; // Regale entlang der X-Achse platzieren
        newShelf.position.y = 0.05; // Regale leicht über dem Boden positionieren
        newShelf.position.z = -1 * (index * (shelfLength + dist)); // Z-Achse bleibt konstant (eine Linie)
        if (x > 0) {
          newShelf.rotation.y = Math.PI / 2;
        } else {
          newShelf.rotation.y = Math.PI * 1.5;
        }

        shelves.push(newShelf);
        _scene.add(newShelf);
      }

      console.log("Model loaded:", gltf);
    },
    (xhr) => {
      // Fortschrittsanzeige (optional)
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      // Fehlerbehandlung
      console.error("An error occurred:", error);
    }
  ); /*
  for (let index = 0; index < floorLength / (shelfWidth + dist); index++) {
    // Geometrie für das Regal
    const material = new MeshStandardMaterial({ color: 0x8b4513 }); // Regal-Material (Holzfarbe)

    const geometry = new BoxGeometry(shelfLength, shelfHeight, shelfWidth);
    const shelf = new Mesh(geometry, material);

    // Position des Regals berechnen
    shelf.position.x = x; // Regale entlang der X-Achse platzieren
    shelf.position.y = shelfHeight / 2; // Regale leicht über dem Boden positionieren
    shelf.position.z = -1 * (index * (shelfLength + dist)); // Z-Achse bleibt konstant (eine Linie)

    // Regal der Szene hinzufügen
    shelves.push(shelf);
    _scene.add(shelf);
  }*/
}

function createLights(scene: Scene, y) {
  for (
    let index = 0;
    index < floorLength / ((shelfWidth + dist) * 2);
    index++
  ) {
    const rectAreaLight = new RectAreaLight(0xffffff, 4.0, 0.7, 2);
    rectAreaLight.position.set(0, 3, -1 * (index * ((shelfLength + dist) * 2)));
    rectAreaLight.lookAt(0, 0, -1 * (index * (shelfLength + dist) * 2)); // Ensure light points at the center

    const rectLightHelper = new RectAreaLightHelper(rectAreaLight); // Helper to visualize the light
    rectAreaLight.add(rectLightHelper);

    scene.add(rectAreaLight);
  }
}

function createCubeCamera(scene: Scene) {
  // CubeCamera für Reflexionen
  _cubeRenderTarget = new WebGLCubeRenderTarget(128, {
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
  });

  // Create cube camera
  _cubeCamera = new CubeCamera(1, 100000, _cubeRenderTarget);

  scene.add(_cubeCamera);
}

function setupScene() {
  //initialize
  const { scene, camera, renderer } = initThree("mountId");
  _scene = scene;
  _camera = camera;
  _camera.aspect = window.innerWidth / window.innerHeight; // Neues Seitenverhältnis
  _camera.updateProjectionMatrix();
  _renderer = renderer;
  createCubeCamera(_scene);
  const floor = new BoxGeometry(10, 0.1, floorLength);
  const floorMaterial = new MeshStandardMaterial({
    color: 0xffffff, // Farbe des Bodens
    roughness: 0.19, // Sehr wenig Rauheit für eine spiegelglatte Oberfläche
    metalness: 0.7, // Maximale Metallizität für Reflexionen
    envMap: _cubeRenderTarget.texture,
    envMapIntensity: 0.5,
  });

  loader.load(
    "/models/altspace_blue_shopping_cart.glb", // Pfad zum GLB-Modell
    (gltf) => {
      shoppingCart = gltf.scene;

      shoppingCart.scale.set(0.02, 0.02, 0.02);
      shoppingCart.position.set(0.7, 0.07, 5);
      shoppingCart.rotation.y = Math.PI / 2;
      // Das geladene Modell wird im `gltf.scene`-Objekt enthalten sein
      _scene.add(shoppingCart);
      console.log("Model loaded:", gltf);
    },
    (xhr) => {
      // Fortschrittsanzeige (optional)
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      // Fehlerbehandlung
      console.error("An error occurred:", error);
    }
  );

  _floor = new Mesh(floor, floorMaterial);
  _floor.position.set(0, 0, 4 + -floorLength / 2);
  _scene.add(_floor);

  const roof = new BoxGeometry(10, 0.1, floorLength);
  const roofMaterial = new MeshStandardMaterial({
    color: 0xeeefee, // Farbe des Bodens
    roughness: 0.5, // Sehr wenig Rauheit für eine spiegelglatte Oberfläche
    metalness: 1, // Maximale Metallizität für Reflexionen
    envMap: _cubeRenderTarget.texture,
    envMapIntensity: 1.0,
  });

  _roof = new Mesh(roof, roofMaterial);
  _roof.position.set(0, 3.1, 4 + -floorLength / 2);
  _scene.add(_roof);

  createShelves(_scene, -1.6);
  createShelves(_scene, 1.6);
  createLights(_scene);
  //create a box and add to scene
  const boxGeometry = new BoxGeometry(1, 1, 1);
  const boxMaterial = new MeshStandardMaterial({ color: 0x00ff00 });

  _box = new Mesh(boxGeometry, boxMaterial);
  _box.position.set(2, 1, -3);
  _scene.add(_box);

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
</script>

<template>
  <canvas id="mountId" width="700" height="500" />
</template>
