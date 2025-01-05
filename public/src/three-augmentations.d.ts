import * as THREE from "three";

declare module "three" {
  interface WebGLRenderer {
    physicallyCorrectLights: boolean;
  }
}
