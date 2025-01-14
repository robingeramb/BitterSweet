<script setup lang="ts">
/* --- Imports --- */
import { useThree, camera, scene } from "@/composables/useThree";
import { useMoveCamera } from "@/composables/moveCamera";
import {
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  CubeCamera,
  WebGLRenderer,
  WebGLCubeRenderTarget,
  TextureLoader,
  NotEqualStencilFunc,
  LinearMipmapLinearFilter,
  RepeatWrapping,
  CircleGeometry,
  AlwaysStencilFunc,
  KeepStencilOp,
  ReplaceStencilOp,
} from "three";

/* --- Props --- */
interface Props {
  mousePos: { x: number; y: number };
  scrollVal: number;
}

const props = defineProps<Props>();

/* --- Reactive Variables and References --- */
let shoppingCart: Mesh | null = null;
let cashRegister: Mesh;
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

async function setupScene(): Promise<void> {
  const { renderer } = initThree("mountId");
  _renderer = renderer;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  createCubeCamera();

  const lights = await createLights(floorLength, shelfWidth, shelfLength, dist);
  scene.add(lights);

  // Floor

  // Texturen laden
  const baseColor = textureLoader.load(
    "/models/textures/ceramic_tiles_seashell_basecolor.png"
  );
  const normalMap = textureLoader.load(
    "/models/textures/ceramic_tiles_seashell_normal.png"
  );
  const roughnessMap = textureLoader.load(
    "/models/textures/ceramic_tiles_seashell_roughness.png"
  );
  const metallicMap = textureLoader.load(
    "/models/textures/ceramic_tiles_seashell_metallic.png"
  );

  // Optional: Height Map (Displacement)
  const displacementMap = textureLoader.load(
    "/models/textures/ceramic_tiles_seashell_height.png"
  );

  const repeatFactor = 16; // Anzahl der Wiederholungen in X- und Y-Richtung
  baseColor.wrapS = RepeatWrapping; // Horizontale Wiederholung aktivieren
  baseColor.wrapT = RepeatWrapping; // Vertikale Wiederholung aktivieren
  baseColor.repeat.set(repeatFactor, repeatFactor); // Kachel-Wiederholungen setzen

  normalMap.wrapS = RepeatWrapping;
  normalMap.wrapT = RepeatWrapping;
  normalMap.repeat.set(repeatFactor, repeatFactor);

  roughnessMap.wrapS = RepeatWrapping;
  roughnessMap.wrapT = RepeatWrapping;
  roughnessMap.repeat.set(repeatFactor, repeatFactor);

  metallicMap.wrapS = RepeatWrapping;
  metallicMap.wrapT = RepeatWrapping;
  metallicMap.repeat.set(repeatFactor, repeatFactor);

  displacementMap.wrapS = RepeatWrapping;
  displacementMap.wrapT = RepeatWrapping;
  displacementMap.repeat.set(repeatFactor, repeatFactor);

  const shoplight = await loadEXR("phone_shop_4k.exr");

  // PBR-Material erstellen
  const ceramicMaterial = new MeshStandardMaterial({
    map: baseColor,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    metalnessMap: metallicMap,
    //envMap: shoplight,
    //envMapIntensity: 0.0,
    displacementMap: displacementMap, // Optional
    displacementScale: 1, // Stärke der Höhenanpassung
  });

  ceramicMaterial.metalness = 1; // Maximale metallische Eigenschaft
  ceramicMaterial.roughness = 0.5; // Mittlere Rauheit
  ceramicMaterial.normalScale.set(1, 1); // Stärke der Normal Map
  const floorGeometry = new BoxGeometry(floorLength + 4, 0.1, floorLength + 4);
  const floorMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1,
    envMap: _cubeRenderTarget.texture,
    envMapIntensity: 1,
  });
  _floor = new Mesh(floorGeometry, ceramicMaterial);
  _floor.position.set(0, -0.49, -floorLength / 2 + 2);
  _floor.receiveShadow = true;
  scene.add(_floor);

  // Roof
  const roofBaseColor = textureLoader.load(
    "/models/textures/tiles_0013_color_2k.jpg"
  );
  const roofNormalMap = textureLoader.load(
    "/models/textures/tiles_0013_normal_opengl_2k.png"
  );
  const roofRoughnessMap = textureLoader.load(
    "/models/textures/tiles_0013_roughness_2k.png"
  );
  const roofMetallicMap = textureLoader.load(
    "/models/textures/tiles_0013_metallic_2k.png"
  );

  // Optional: Height Map (Displacement)
  const roofDisplacementMap = textureLoader.load(
    "/models/textures/tiles_0013_height_2k.png"
  );

  const roofRepeatFactor = 3.5; // Anzahl der Wiederholungen in X- und Y-Richtung
  roofBaseColor.wrapS = RepeatWrapping; // Horizontale Wiederholung aktivieren
  roofBaseColor.wrapT = RepeatWrapping; // Vertikale Wiederholung aktivieren
  roofBaseColor.repeat.set(roofRepeatFactor, roofRepeatFactor); // Kachel-Wiederholungen setzen

  roofNormalMap.wrapS = RepeatWrapping;
  roofNormalMap.wrapT = RepeatWrapping;
  roofNormalMap.repeat.set(roofRepeatFactor, roofRepeatFactor);

  roofRoughnessMap.wrapS = RepeatWrapping;
  roofRoughnessMap.wrapT = RepeatWrapping;
  roofRoughnessMap.repeat.set(roofRepeatFactor, roofRepeatFactor);

  roofMetallicMap.wrapS = RepeatWrapping;
  roofMetallicMap.wrapT = RepeatWrapping;
  roofMetallicMap.repeat.set(roofRepeatFactor, roofRepeatFactor);

  roofDisplacementMap.wrapS = RepeatWrapping;
  roofDisplacementMap.wrapT = RepeatWrapping;
  roofDisplacementMap.repeat.set(roofRepeatFactor, roofRepeatFactor);

  const roofGeometry = new BoxGeometry(floorLength + 4, 0.1, floorLength + 4);
  const roofMaterial = new MeshStandardMaterial({
    map: roofBaseColor,
    normalMap: roofNormalMap,
    roughnessMap: roofRoughnessMap,
    metalnessMap: roofMetallicMap,
    //envMap: shoplight,
    //envMapIntensity: 0.5,
    displacementMap: roofDisplacementMap, // Optional
    displacementScale: 0.1, // Stärke der Höhenanpassung
  });
  roofMaterial.metalness = 0.1; // Maximale metallische Eigenschaft
  roofMaterial.roughness = 0.1; // Mittlere Rauheit
  roofMaterial.normalScale.set(0.1, 0.1); // Stärke der Normal Map
  _roof = new Mesh(roofGeometry, roofMaterial);
  _roof.material.transparent = !0;

  _roof.position.set(0, 3.16, -floorLength / 2 + 2);
  scene.add(_roof);

  //walls

  // wall
  const wallBaseColor = textureLoader.load(
    "/models/textures/Plaster_02_diffuse.jpg"
  );
  const wallNormalMap = textureLoader.load(
    "/models/textures/Plaster_02_normal.jpg"
  );
  const wallRoughnessMap = textureLoader.load(
    "/models/textures/Plaster_02_glossiness.jpg"
  );
  const wallMetallicMap = textureLoader.load(
    "/models/textures/Plaster_02_bump.jpg"
  );

  const wallRepeatFactor = 36; // Anzahl der Wiederholungen in X- und Y-Richtung
  wallBaseColor.wrapS = RepeatWrapping; // Horizontale Wiederholung aktivieren
  wallBaseColor.wrapT = RepeatWrapping; // Vertikale Wiederholung aktivieren
  wallBaseColor.repeat.set(wallRepeatFactor, wallRepeatFactor); // Kachel-Wiederholungen setzen

  wallNormalMap.wrapS = RepeatWrapping;
  wallNormalMap.wrapT = RepeatWrapping;
  wallNormalMap.repeat.set(wallRepeatFactor, wallRepeatFactor);

  wallRoughnessMap.wrapS = RepeatWrapping;
  wallRoughnessMap.wrapT = RepeatWrapping;
  wallRoughnessMap.repeat.set(wallRepeatFactor, wallRepeatFactor);

  wallMetallicMap.wrapS = RepeatWrapping;
  wallMetallicMap.wrapT = RepeatWrapping;
  wallMetallicMap.repeat.set(wallRepeatFactor, wallRepeatFactor);

  const wallGeometry = new BoxGeometry(0.1, floorLength + 4, floorLength + 4);
  const wallMaterial = new MeshStandardMaterial({
    map: wallBaseColor,
    normalMap: wallNormalMap,
    roughnessMap: wallRoughnessMap,
    metalnessMap: wallMetallicMap,
    //envMap: shoplight,
    //envMapIntensity: 0.5,
  });
  const wall = new Mesh(wallGeometry, wallMaterial);
  wall.castShadow = true;
  wall.receiveShadow = true;
  const wall2 = wall.clone();
  const wall3 = wall.clone();
  scene.add(wall);
  scene.add(wall2);
  scene.add(wall3);
  wall.position.set(-1.91, -floorLength / 2 + 0.4, -floorLength / 2 + 8);
  wall2.position.set(1.91, -floorLength / 2 + 0.4, -floorLength / 2 + 8);
  wall3.position.set(1.91, 1.3, -floorLength - 2);
  wall3.rotation.y = Math.PI / 2;

  //shoppingcart

  const metalNormalMap = textureLoader.load("/models/textures/Normals.png");
  const metalRoughnessMap = textureLoader.load(
    "/models/textures/Roughness.png"
  );
  const metalBaseColor = textureLoader.load("/models/textures/BaseColor.png");
  const metalMetallicMap = textureLoader.load("/models/textures/Metallic.png");
  const height = textureLoader.load("/models/textures/Height.png");

  const metal = new MeshStandardMaterial({
    map: metalBaseColor,
    metalness: 1,
    //normalMap: metalNormalMap,
    roughnessMap: metalRoughnessMap,
    //metalnessMap: metalMetallicMap,
    roughness: 0.1,
    envMap: shoplight,
    envMapIntensity: 0.1,
    displacementMap: displacementMap, // Optional
    displacementScale: 0.1, // Stärke der Höhenanpassung
  });

  // Shopping cart
  try {
    shoppingCart = await loadModel("shoppingcart.glb");
    if (shoppingCart) {
      shoppingCart.scale.set(0.01, 0.01, 0.01);
      shoppingCart.position.set(0, 0.95, -1);
      //shoppingCart.rotation.y = Math.PI / 2;
      shoppingCart.traverse((child) => {
        child.castShadow = true;
        if (child.material) {
          child.material = metal;
        }
      });
      scene.add(shoppingCart);

      generateShoppingCartBorderBox();
    }
  } catch (error) {
    console.error("Failed to load shopping cart model:", error);
  }

  // cashRegister

  try {
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
  } catch (error) {
    console.error("Failed to load shopping cashRegister:", error);
  }

  // Shelves and lights
  createShelves(-1.6, floorLength, shelfWidth, shelfLength, dist, shelfHeight);
  createShelves(1.6, floorLength, shelfWidth, shelfLength, dist, shelfHeight);

  //Post-Proccessing
  postProcessing(cashRegister);
  //tasksDone = true;
  console.log("done");
  _renderLoopId = requestAnimationFrame(renderLoop);
}

function renderLoop(): void {
  _cubeCamera.position.copy(camera.position);
  _cubeCamera.update(_renderer, scene);
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
onMounted((): void => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    window.addEventListener("click", (event: MouseEvent) => {
      clickEvent(event, selectMode.value);
      clickCheckout(event, cashRegister);
    });
  }
});

onBeforeUnmount((): void => {
  cancelAnimationFrame(_renderLoopId);
  cleanUpThree(scene, _renderer);
});

/* --- Exposed Functions --- */
defineExpose({ leaveSelectMode, setupScene });
</script>

<template>
  <canvas id="mountId" width="700" height="500" />
  <!-- <div class="fixed top-2 right-2 text-white font-semibold text-4xl">
    <p v-if="!endScreen" v-html="sugarCounter"></p>
  </div>-->
  <ProductSelectMenu v-if="selectMode" />
</template>
