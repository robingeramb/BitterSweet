import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  RectAreaLight,
  Color,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  AmbientLight,
  Group,
  Raycaster,
  Vector2,
  Vector3,
  Clock,
  PCFSoftShadowMap
} from "three";
import CANNON from "cannon";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

// --- 2. Cannon.js Setup ---
export const world = new CANNON.World();

import { disposeObject } from "@/utils/disposeUtils";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";

export const scene = new Scene();
export let _composer: EffectComposer;
export const camera = new PerspectiveCamera(50, 200 / 200, 0.1, 1000);
export const productSelection = new Group();
export const physicObjects = new Map();
export let currX = ref();
export let currY = ref();
export let savedPos = new Vector3();
export let selectMode = ref(false);
export const raycaster = new Raycaster();
export const mouse = new Vector2();
export const sugarCounter = ref(0);
export const clock = new Clock();
export let addedProductsInCart = ref(0);
export let taskDone = ref(false);
export let endScreen = ref(false);
export let productsInCart = new Group();

export function useThree() {
  function initThree(canvasMountId: string) {
    const canvas = document.getElementById(canvasMountId)! as HTMLCanvasElement;
    const ambientLight = new AmbientLight(0xffffff, 0.5);

    camera.position.set(0, 1, 4);
    camera.lookAt(0, 0, 0);

    scene.background = new Color(0x000000);
    scene.add(ambientLight);
    scene.add(productSelection);

    world.gravity.set(0, -9.82, 0); // Schwerkraft (z. B. Erde)

    // Material für die physikalischen Objekte
    const defaultMaterial = new CANNON.Material("default");
    const contactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.5, // Reibung
        restitution: 0.1, // Elastizität
        contactEquationRelaxation: 7,
      }
    );
    world.defaultContactMaterial = contactMaterial;
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true; // Lässt inaktive Körper "einschlafen"
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 3;
    world.defaultContactMaterial.frictionEquationStiffness = 1e8;
    world.defaultContactMaterial.frictionEquationRelaxation = 3;

    // Add an object to illuminate

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true; // Enable physical lighting
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setPixelRatio(window.devicePixelRatio); // Nutzt die native Pixeldichte des Geräts
    _composer = new EffectComposer(renderer);

    return { renderer };
  }

  function cleanUpThree(scene: Scene, renderer: WebGLRenderer) {
    disposeObject(scene);
    renderer.dispose();
  }

  return {
    initThree,
    cleanUpThree,
  };
}
