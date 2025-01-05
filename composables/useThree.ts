import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  RectAreaLight,
  Color,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
} from "three";
import { disposeObject } from "@/utils/disposeUtils";

export function useThree() {
  function initThree(canvasMountId: string) {
    const canvas = document.getElementById(canvasMountId)! as HTMLCanvasElement;

    const camera = new PerspectiveCamera(50, 200 / 200, 0.1, 1000);
    camera.position.set(0, 1, 4);
    camera.lookAt(0, 0, 0);

    const scene = new Scene();
    scene.background = new Color(0x000000);

    // Add an object to illuminate

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
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
