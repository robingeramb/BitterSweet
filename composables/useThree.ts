import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  RectAreaLight,
  Color,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  AmbientLight,
  PCFSoftShadowMap,
} from "three";
import { disposeObject } from "@/utils/disposeUtils";

export function useThree() {
  function initThree(canvasMountId: string) {
    const canvas = document.getElementById(canvasMountId)! as HTMLCanvasElement;
    const ambientLight = new AmbientLight(0xffffff, 0.05);
    const camera = new PerspectiveCamera(50, 200 / 200, 0.1, 1000);
    camera.position.set(0, 1, 4);
    camera.lookAt(0, 0, 0);

    const scene = new Scene();
    scene.background = new Color(0x000000);
    scene.add(ambientLight);

    // Add an object to illuminate

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true; // Enable physical lighting

    return { scene, camera, renderer };
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
