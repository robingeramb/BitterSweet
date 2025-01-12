import CANNON from "cannon";
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
export const generateShoppingCartBorderBox = () => {
  const x = 0.35;
  const y = 0.3;
  const z = 0.7;
  const h = 0.1;

  // Visualisiere das Box-Objekt mit Three.js
  const geometry = new BoxGeometry(x, h, z); // Maßstab in Three.js
  const material = new MeshStandardMaterial({
    color: 0xff0000,
    opacity: 0,
    transparent: true,
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(0, -h / 2, 0);

  const boxShape = new CANNON.Box(new CANNON.Vec3(x, h / 2, z)); // Rechteckige Box (2x1x0.5)
  const boxBody = new CANNON.Body({
    mass: 0, // Die Masse des Körpers
    position: new CANNON.Vec3(0, -h / 2, 0), // Anfangsposition (x, y, z)
  });
  boxBody.addShape(boxShape);

  const wallRight = new BoxGeometry(h, y, z); // Maßstab in Three.js
  const wallRightMesh = new Mesh(wallRight, material);
  wallRightMesh.position.set(-x / 2 - h / 2, y / 2, 0);
  const wallRightCA = new CANNON.Box(new CANNON.Vec3(h / 2, y / 2, z / 2)); // Rechteckige Box (2x1x0.5)
  const wallRightBodyCA = new CANNON.Body({
    mass: 0, // Die Masse des Körpers
    position: new CANNON.Vec3(-x / 2 - h / 2, y / 2, 0), // Anfangsposition (x, y, z)
  });
  wallRightBodyCA.addShape(wallRightCA);

  const wallLeftMesh = new Mesh(wallRight, material);
  wallLeftMesh.position.set(x / 2 + h / 2, y / 2, 0);

  const wallLeftCA = new CANNON.Box(new CANNON.Vec3(h / 2, y / 2, z / 2)); // Rechteckige Box (2x1x0.5)
  const wallLeftBodyCA = new CANNON.Body({
    mass: 0, // Die Masse des Körpers
    position: new CANNON.Vec3(x / 2 + h / 2, y / 2, 0), // Anfangsposition (x, y, z)
  });
  wallLeftBodyCA.addShape(wallLeftCA);

  const wallBack = new BoxGeometry(x, y, h); // Maßstab in Three.js
  const wallBackMesh = new Mesh(wallBack, material);
  wallBackMesh.position.set(0, y / 2, -z / 2 - h / 2);

  const wallBackCA = new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, h / 2)); // Rechteckige Box (2x1x0.5)
  const wallBackBodyCA = new CANNON.Body({
    mass: 0, // Die Masse des Körpers
    position: new CANNON.Vec3(0, y / 2, -z / 2 - h / 2), // Anfangsposition (x, y, z)
  });
  wallBackBodyCA.addShape(wallBackCA);

  const wallFrontMesh = new Mesh(wallBack, material);
  wallFrontMesh.position.set(0, y / 2, z / 2 + h / 2);

  const wallFrontCA = new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, h / 2)); // Rechteckige Box (2x1x0.5)
  const wallFrontBodyCA = new CANNON.Body({
    mass: 0, // Die Masse des Körpers
    position: new CANNON.Vec3(0, y / 2, z / 2 + h / 2), // Anfangsposition (x, y, z)
  });
  wallFrontBodyCA.addShape(wallFrontCA);

  /* productSelection.add(wallBackMesh);
      productSelection.add(wallFrontMesh);
      productSelection.add(wallRightMesh);
      productSelection.add(wallLeftMesh);
      productSelection.add(mesh);*/

  world.addBody(boxBody);
  world.addBody(wallFrontBodyCA);
  world.addBody(wallBackBodyCA);
  world.addBody(wallLeftBodyCA);
  world.addBody(wallRightBodyCA);
};
