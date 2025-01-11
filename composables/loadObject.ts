import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export function loadModel(name: string): Promise<any> {
  return new Promise((resolve, reject) => {
    loader.load(
      `/models/${name}`, // Pfad zum GLB-Modell
      (gltf) => {
        const model = gltf.scene;
        model.castShadow = true;
        model.receiveShadow = true;
        resolve(model); // Modell wird erfolgreich zurückgegeben
      },
      undefined, // Fortschrittsanzeige, falls gewünscht
      (error) => {
        console.error("An error occurred while loading the model:", error);
        reject(error); // Fehler an die Promise weitergeben
      }
    );
  });
}
