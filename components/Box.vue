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
  LinearMipmapLinearFilter,
  RepeatWrapping,
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

  // Floor
  const textureLoader = new TextureLoader();

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
    "/models/ceramic_tiles_seashell/ceramic_tiles_seashell_height.png"
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
    displacementScale: 0.1, // Stärke der Höhenanpassung
  });

  ceramicMaterial.metalness = 1; // Maximale metallische Eigenschaft
  ceramicMaterial.roughness = 0.5; // Mittlere Rauheit
  ceramicMaterial.normalScale.set(1, 1); // Stärke der Normal Map
  const floorGeometry = new BoxGeometry(floorLength, 0.1, floorLength);
  const floorMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1,
    envMap: _cubeRenderTarget.texture,
    envMapIntensity: 1,
  });
  _floor = new Mesh(floorGeometry, ceramicMaterial);
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

  const metalNormalMap = textureLoader.load("/models/textures/Normals.png");
  const metalRoughnessMap = textureLoader.load(
    "/models/textures/Roughness.png"
  );
  const metalBaseColor = textureLoader.load("/models/textures/BaseColor.png");
  const metalMetallicMap = textureLoader.load("/models/textures/Metallic.png");

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
  try {
    let nudeln = await loadModel("nudeln.glb");
    if (nudeln) {
      nudeln.scale.set(0.1, 0.1, 0.1);
      nudeln.position.set(1.5, 0.8, -16);
      nudeln.rotation.y = Math.PI * 2;
      nudeln.traverse((child) => {
        child.castShadow = true;
      });
      scene.add(nudeln);
    }
  } catch (error) {
    console.error("Failed to load shopping cashRegister:", error);
  }
  try {
    let sauce = await loadModel("tomatensauce.glb");
    if (sauce) {
      sauce.scale.set(0.1, 0.1, 0.1);
      sauce.position.set(-1, 0.8, -16);
      sauce.rotation.y = Math.PI * 2;
      sauce.traverse((child) => {
        child.castShadow = true;
      });
      scene.add(sauce);
    }
  } catch (error) {
    console.error("Failed to load shopping cashRegister:", error);
  }

  // Shelves and lights
  createShelves(-1.6, floorLength, shelfWidth, shelfLength, dist, shelfHeight);
  createShelves(1.6, floorLength, shelfWidth, shelfLength, dist, shelfHeight);

  const lights = createLights(floorLength, shelfWidth, shelfLength, dist);
  scene.add(lights);

  //Post-Proccessing
  postProcessing(cashRegister);
  //tasksDone = true;
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
  <ProductSelectMenu v-if="selectMode" />
</template>
