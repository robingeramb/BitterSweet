import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
const rgbeLoader = new EXRLoader();

export function loadEXR(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    rgbeLoader.load(
      `/models/globallights/${path}`,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping; // Für Reflexionen
        //scene.environment = texture;
        resolve(texture);
      },
      undefined, // Fortschrittsanzeige, falls gewünscht
      (error) => {
        console.error("An error occurred while loading the model:", error);
        reject(error); // Fehler an die Promise weitergeben
      }
    );
  });
}
