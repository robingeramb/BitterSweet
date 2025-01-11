<script setup lang="ts">
/* --- Imports --- */
import CANNON from "cannon";
import { useThree, camera, scene } from "@/composables/useThree";
import { useMoveCamera } from "@/composables/moveCamera";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  CubeCamera,
  WebGLRenderer,
  WebGLCubeRenderTarget,
  LinearMipmapLinearFilter,
} from "three";

/* --- Props --- */
interface Props {
  mousePos: { x: number; y: number };
  scrollVal: number;
}

const props = defineProps<Props>();

/* --- Reactive Variables and References --- */
let shoppingCart: Mesh | null = null;
const sugarCounter = ref<number>(0);
let _cubeRenderTarget: WebGLCubeRenderTarget;
let _renderer: WebGLRenderer;
let _cubeCamera: CubeCamera;
let _renderLoopId: number;
let _floor: Mesh;
let _roof: Mesh;

/* --- Constants --- */
const floorLength: number = 20;
const shelfLength: number = 0.5;
const shelfHeight: number = 2;
const shelfWidth: number = 2.5;
const dist: number = 2.2;

/* --- Composables --- */
const { initThree, cleanUpThree } = useThree();
const { moveCameraZ, moveCameraXY } = useMoveCamera();
const canvas = computed(
  (): HTMLCanvasElement | null =>
    document.getElementById("mountId") as HTMLCanvasElement
);

/* --- Watches --- */
watch(
  () => props.scrollVal,
  (newValue: number) => moveCameraZ(newValue)
);

watch(
  () => [props.mousePos.x, props.mousePos.y],
  ([newX, newY]: [number, number]) => moveCameraXY(newX, newY)
);

/* --- Functions --- */
function createCubeCamera(): void {
  _cubeRenderTarget = new WebGLCubeRenderTarget(128, {
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
  });
  _cubeCamera = new CubeCamera(1, 100000, _cubeRenderTarget);
}

async function loadModel(name: string): Promise<Mesh | null> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      `/models/${name}`,
      (gltf) => resolve(gltf.scene as Mesh),
      undefined,
      (error) => reject(error)
    );
  });
}

async function setupScene(): Promise<void> {
  const { renderer } = initThree("mountId");
  _renderer = renderer;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  createCubeCamera();

  // Floor
  const floorGeometry = new BoxGeometry(10, 0.1, floorLength);
  const floorMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1,
    envMap: _cubeRenderTarget.texture,
    envMapIntensity: 1,
  });
  _floor = new Mesh(floorGeometry, floorMaterial);
  _floor.position.set(0, 0, -floorLength / 2);
  _floor.receiveShadow = true;
  scene.add(_floor);

  // Roof
  const roofGeometry = new BoxGeometry(10, 0.1, floorLength);
  const roofMaterial = new MeshStandardMaterial({
    color: 0xeeefee,
    roughness: 0.5,
    metalness: 0.5,
  });
  _roof = new Mesh(roofGeometry, roofMaterial);
  _roof.position.set(0, 3.1, -floorLength / 2);
  scene.add(_roof);

  // Shopping cart
  try {
    shoppingCart = await loadModel("altspace_blue_shopping_cart.glb");
    if (shoppingCart) {
      shoppingCart.scale.set(0.02, 0.02, 0.02);
      shoppingCart.position.set(0.717, 0.07, 5);
      shoppingCart.rotation.y = Math.PI / 2;
      shoppingCart.traverse((child) => {
        child.castShadow = true;
      });
      scene.add(shoppingCart);

      const x = 0.35;
      const y = 0.3;
      const z = 0.7;
      const h = 0.1;

      // Visualisiere das Box-Objekt mit Three.js
      const geometry = new BoxGeometry(x, h, z); // Maßstab in Three.js
      const material = new MeshStandardMaterial({
        color: 0xff0000,
        opacity: 0,
        transparent: true,
      });
      const mesh = new Mesh(geometry, material);
      mesh.position.set(0, -h / 2, 0);

      const boxShape = new CANNON.Box(new CANNON.Vec3(x, h / 2, z)); // Rechteckige Box (2x1x0.5)
      const boxBody = new CANNON.Body({
        mass: 0, // Die Masse des Körpers
        position: new CANNON.Vec3(0, -h / 2, 0), // Anfangsposition (x, y, z)
      });
      boxBody.addShape(boxShape);

      const wallRight = new BoxGeometry(h, y, z); // Maßstab in Three.js
      const wallRightMesh = new Mesh(wallRight, material);
      wallRightMesh.position.set(-x / 2 - h / 2, y / 2, 0);
      const wallRightCA = new CANNON.Box(new CANNON.Vec3(h / 2, y / 2, z / 2)); // Rechteckige Box (2x1x0.5)
      const wallRightBodyCA = new CANNON.Body({
        mass: 0, // Die Masse des Körpers
        position: new CANNON.Vec3(-x / 2 - h / 2, y / 2, 0), // Anfangsposition (x, y, z)
      });
      wallRightBodyCA.addShape(wallRightCA);

      const wallLeftMesh = new Mesh(wallRight, material);
      wallLeftMesh.position.set(x / 2 + h / 2, y / 2, 0);

      const wallLeftCA = new CANNON.Box(new CANNON.Vec3(h / 2, y / 2, z / 2)); // Rechteckige Box (2x1x0.5)
      const wallLeftBodyCA = new CANNON.Body({
        mass: 0, // Die Masse des Körpers
        position: new CANNON.Vec3(x / 2 + h / 2, y / 2, 0), // Anfangsposition (x, y, z)
      });
      wallLeftBodyCA.addShape(wallLeftCA);

      const wallBack = new BoxGeometry(x, y, h); // Maßstab in Three.js
      const wallBackMesh = new Mesh(wallBack, material);
      wallBackMesh.position.set(0, y / 2, -z / 2 - h / 2);

      const wallBackCA = new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, h / 2)); // Rechteckige Box (2x1x0.5)
      const wallBackBodyCA = new CANNON.Body({
        mass: 0, // Die Masse des Körpers
        position: new CANNON.Vec3(0, y / 2, -z / 2 - h / 2), // Anfangsposition (x, y, z)
      });
      wallBackBodyCA.addShape(wallBackCA);

      const wallFrontMesh = new Mesh(wallBack, material);
      wallFrontMesh.position.set(0, y / 2, z / 2 + h / 2);

      const wallFrontCA = new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, h / 2)); // Rechteckige Box (2x1x0.5)
      const wallFrontBodyCA = new CANNON.Body({
        mass: 0, // Die Masse des Körpers
        position: new CANNON.Vec3(0, y / 2, z / 2 + h / 2), // Anfangsposition (x, y, z)
      });
      wallFrontBodyCA.addShape(wallFrontCA);

      console.log(wallLeftBodyCA.position);
      console.log(wallRightBodyCA.position);

      /* productSelection.add(wallBackMesh);
      productSelection.add(wallFrontMesh);
      productSelection.add(wallRightMesh);
      productSelection.add(wallLeftMesh);
      productSelection.add(mesh);*/

      world.addBody(boxBody);
      world.addBody(wallFrontBodyCA);
      world.addBody(wallBackBodyCA);
      world.addBody(wallLeftBodyCA);
      world.addBody(wallRightBodyCA);
    }
  } catch (error) {
    console.error("Failed to load shopping cart model:", error);
  }

  // Counter

  try {
    let counter = await loadModel("kasse.glb");
    if (counter) {
      counter.scale.set(0.2, 0.2, 0.2);
      counter.position.set(1.5, 0.05, -16);
      counter.rotation.y = Math.PI / 2;
      counter.traverse((child) => {
        child.castShadow = true;
      });
      scene.add(counter);
    }
  } catch (error) {
    console.error("Failed to load shopping cart model:", error);
  }

  // Shelves and lights
  createShelves(-1.6, floorLength, shelfWidth, shelfLength, dist, shelfHeight);
  createShelves(1.6, floorLength, shelfWidth, shelfLength, dist, shelfHeight);

  const lights = createLights(floorLength, shelfWidth, shelfLength, dist);
  scene.add(lights);

  _renderLoopId = requestAnimationFrame(renderLoop);
}

function renderLoop(): void {
  _cubeCamera.position.copy(camera.position);
  _cubeCamera.update(_renderer, scene);
  if (shoppingCart && !selectMode.value) {
    shoppingCart.position.set(0.717, 0.07, camera.position.z + 1);
    productSelection.position.set(0, 0.42, camera.position.z - 0.95);
  } else {
    if (shoppingCart && selectMode.value) {
      shoppingCart.position.set(0.717, 0.07, camera.position.z + 1.5);
      productSelection.position.set(0, 0.42, camera.position.z - 0.45);
    }
  }
  world.step(1 / 60); // Update Cannon.js physics world

  // Iteriere durch alle Objekte und aktualisiere Position und Rotation
  for (let [threeObj, cannonObj] of physicObjects) {
    threeObj.position.copy(cannonObj.position);
    console.log(cannonObj);
    threeObj.quaternion.copy(cannonObj.quaternion);
  }

  _renderer.render(scene, camera);
  _renderLoopId = requestAnimationFrame(renderLoop);
}

function leaveSelectMode(): void {
  if (selectMode.value) {
    camera.position.set(savedPos.x, savedPos.y, savedPos.z);
    camera.lookAt(0, 0, camera.position.z - 4);
    selectMode.value = false;
  }
}

/* --- Lifecycle Hooks --- */
onMounted((): void => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    window.addEventListener("click", (event: MouseEvent) =>
      clickEvent(event, selectMode.value)
    );
    setupScene();
  }
});

onBeforeUnmount((): void => {
  cancelAnimationFrame(_renderLoopId);
  cleanUpThree(scene, _renderer);
});

/* --- Exposed Functions --- */
defineExpose({ leaveSelectMode });
</script>

<template>
  <canvas id="mountId" width="700" height="500" />
  <div class="fixed top-2 right-2 text-white font-semibold text-4xl">
    <p v-html="sugarCounter"></p>
  </div>
</template>
