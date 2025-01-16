import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader(loadingManager);
let models = {};

export function loadModel(name: string): Promise<any> {
  if (models[name]) {
    let newModel = models[name].clone();
    newModel.position.copy(models[name].position.clone());
    newModel.scale.set(1, 1, 1);
    return Promise.resolve(newModel);
  }

  return new Promise((resolve, reject) => {
    loader.load(
      `/models/${name}`, // Pfad zum GLB-Modell
      (gltf) => {
        const model = gltf.scene;
        model.castShadow = true;
        model.receiveShadow = true;
        models[name] = model;
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
