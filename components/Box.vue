<script setup lang="ts">
/* --- Imports --- */
import { useThree, camera, scene } from "@/composables/useThree";
import { useMoveCamera } from "@/composables/moveCamera";
import { BoxGeometry, Mesh, WebGLRenderer } from "three";

/* --- Props --- */
interface Props {
  mousePos: { x: number; y: number };
  scrollVal: number;
}
const props = defineProps<Props>();

/* --- Reactive Variables and References --- */
let shoppingCart: Mesh | null = null;
let cashRegister: Mesh;
let _renderer: WebGLRenderer;
let _renderLoopId: number;
let _floor: Mesh;
let _roof: Mesh;

/* --- Constants --- */
const floorLength = 20;
const shelfLength = 0.5;
const shelfHeight = 2;
const shelfWidth = 2.5;
const dist = 2.2;

/* --- Composables --- */
const { initThree, cleanUpThree } = useThree();
const { moveCameraZ, moveCameraXY } = useMoveCamera();
const canvas = computed(
  (): HTMLCanvasElement | null =>
    document.getElementById("mountId") as HTMLCanvasElement
);

/* --- Watches --- */
watch(() => props.scrollVal, moveCameraZ);
watch(
  () => [props.mousePos.x, props.mousePos.y],
  ([newX, newY]) => moveCameraXY(newX, newY)
);

/* --- Functions --- */
async function setupScene(): Promise<void> {
  const { renderer } = initThree("mountId");
  _renderer = renderer;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  const lights = await createLights(floorLength, shelfWidth, shelfLength, dist);
  scene.add(lights);

  const shoplight = await loadEXR("phone_shop_4k.exr");

  setupFloor();
  setupRoof();
  setupWalls();
  await setupShoppingCart(shoplight);
  await setupCashRegister();

  createShelves(-1.6, floorLength, shelfWidth, shelfLength, dist, shelfHeight);
  createShelves(1.6, floorLength, shelfWidth, shelfLength, dist, shelfHeight);

  postProcessing(cashRegister);
  _renderLoopId = requestAnimationFrame(renderLoop);
}

function setupFloor(): void {
  const ceramicMaterial = createTexture(
    "ceramic_tiles",
    16,
    true,
    true,
    true,
    true,
    true,
    1,
    0.5,
    1,
    1
  );
  const floorGeometry = new BoxGeometry(floorLength + 4, 0.1, floorLength + 4);

  _floor = new Mesh(floorGeometry, ceramicMaterial);
  _floor.position.set(0, -0.49, -floorLength / 2 + 2);
  _floor.receiveShadow = true;
  scene.add(_floor);
}

function setupRoof(): void {
  const roofMaterial = createTexture(
    "ceiling_tiles",
    3.5,
    true,
    true,
    true,
    true,
    true,
    0.1,
    0.1,
    0.1,
    0.1
  );
  const roofGeometry = new BoxGeometry(floorLength + 4, 0.1, floorLength + 4);

  _roof = new Mesh(roofGeometry, roofMaterial);
  _roof.position.set(0, 3.16, -floorLength / 2 + 2);
  _roof.material.transparent = true;
  scene.add(_roof);
}

function setupWalls(): void {
  const wallMaterial = createTexture(
    "wallpaper_rough",
    36,
    true,
    true,
    true,
    true,
    false,
    0.1
  );
  const wallGeometry = new BoxGeometry(0.1, floorLength + 4, floorLength + 4);

  const wall = new Mesh(wallGeometry, wallMaterial);
  wall.castShadow = true;
  wall.receiveShadow = true;

  const wall2 = wall.clone();
  const wall3 = wall.clone();

  wall.position.set(-1.91, -floorLength / 2 + 0.4, -floorLength / 2 + 8);
  wall2.position.set(1.91, -floorLength / 2 + 0.4, -floorLength / 2 + 8);
  wall3.position.set(1.91, 1.3, -floorLength - 2);
  wall3.rotation.y = Math.PI / 2;

  scene.add(wall, wall2, wall3);
}

async function setupShoppingCart(shoplight: any): Promise<void> {
  const metal = createTexture(
    "shoppingCart",
    1,
    true,
    false,
    true,
    false,
    true,
    1,
    0.1,
    1,
    0.1
  );
  metal.envMap = shoplight;
  metal.envMapIntensity = 0.1;

  shoppingCart = await loadModel("shoppingcart.glb");
  if (shoppingCart) {
    shoppingCart.scale.set(0.01, 0.01, 0.01);
    shoppingCart.position.set(0, 0.95, -1);
    shoppingCart.traverse((child) => {
      child.castShadow = true;
      if (child.material) {
        child.material = metal;
      }
    });
    scene.add(shoppingCart);

    generateShoppingCartBorderBox();
  }
}

async function setupCashRegister(): Promise<void> {
  cashRegister = await loadModel("kasse.glb");
  if (cashRegister) {
    cashRegister.scale.set(0.2, 0.2, 0.2);
    cashRegister.position.set(0.8, 0.07, -16);
    cashRegister.rotation.y = Math.PI / 2;
    cashRegister.traverse((child) => {
      child.castShadow = true;
    });
    scene.add(cashRegister);
  }
}

function renderLoop(): void {
  if (shoppingCart && !selectMode.value) {
    shoppingCart.position.set(0, 0.1, camera.position.z - 1);
    productSelection.position.set(0, 0.42, camera.position.z - 0.95);
  } else {
    if (shoppingCart && selectMode.value) {
      shoppingCart.position.set(0, 0.1, camera.position.z - 0.5);
      productSelection.position.set(0, 0.42, camera.position.z - 0.45);
    }
  }
  const fixedTimeStep = 1 / 120; // 120 FPS
  const maxSubSteps = 10; // Maximale Unterteilungen pro Frame
  const deltaTime = clock.getDelta();
  world.step(fixedTimeStep, deltaTime, maxSubSteps);

  // Iteriere durch alle Objekte und aktualisiere Position und Rotation
  for (let [threeObj, cannonObj] of physicObjects) {
    threeObj.position.copy(cannonObj.position);
    threeObj.quaternion.copy(cannonObj.quaternion);
  }

  if (taskDone.value == true) {
    _composer.render();
  } else {
    _renderer.render(scene, camera);
  }
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
onMounted(() => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    window.addEventListener("click", (event) => {
      clickEvent(event, selectMode.value);
      clickCheckout(event, cashRegister);
    });
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(_renderLoopId);
  cleanUpThree(scene, _renderer);
});

/* --- Exposed Functions --- */
defineExpose({ leaveSelectMode, setupScene });
</script>

<template>
  <canvas id="mountId" width="700" height="500" />
  <ProductSelectMenu v-if="selectMode" />
</template>
