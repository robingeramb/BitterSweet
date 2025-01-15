import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export function postProcessing(cashRegister) {
  const renderPass = new RenderPass(scene, camera);

  _composer.addPass(renderPass);

  const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );

  outlinePass.selectedObjects = [cashRegister];
  outlinePass.visibleEdgeColor.set(0x65ed55);
  outlinePass.hiddenEdgeColor.set(0x000000);
  outlinePass.edgeStrength = 2.0;
  outlinePass.edgeThickness = 0.5;
  outlinePass.edgeGlow = 0.5;
  outlinePass.pulsePeriod = 4;

  _composer.addPass(outlinePass);
  // RenderPass für die normale Szene

  textureLoader.load("textures/tri_pattern.jpg", function (texture) {
    outlinePass.patternTexture = texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  const outputPass = new OutputPass();
  _composer.addPass(outputPass);
}
