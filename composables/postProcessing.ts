import * as THREE from "three"
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export function postProcessing(cashRegister){
    const renderPass = new RenderPass(scene, camera);

  _composer.addPass(renderPass);

  const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

  outlinePass.selectedObjects = [cashRegister];
  outlinePass.visibleEdgeColor.set(0x65ed55);
  outlinePass.hiddenEdgeColor.set(0x000000);
  outlinePass.edgeStrength = 5.0;
  outlinePass.edgeThickness = 2;

  _composer.addPass(outlinePass);

  const textureLoader = new THREE.TextureLoader();
      textureLoader.load( 'textures/tri_pattern.jpg', function ( texture ) {

        outlinePass.patternTexture = texture;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

  } );

  const outputPass = new OutputPass();
  _composer.addPass( outputPass );
}