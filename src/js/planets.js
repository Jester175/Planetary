import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import starsTexture from "../img/stars.jpg";
import sunTexture from "../img/sun.jpg";
import mercuryTexture from "../img/mercury.jpg";
import venusTexture from "../img/venus.jpg";
import earthTexture from "../img/earth.jpg";
import marsTexture from "../img/mars.jpg";
import jupiterTexture from "../img/jupiter.jpg";
import saturnTexture from "../img/saturn.jpg";
import saturnRingTexture from "../img/saturn ring.png";
import uranusTexture from "../img/uranus.jpg";
import uranusRingTexture from "../img/uranus ring.png";
import neptuneTexture from "../img/neptune.jpg";
import plutoTexture from "../img/pluto.jpg";

const render = new THREE.WebGLRenderer();

render.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(render.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, render.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const textureLoader = new THREE.TextureLoader();

function createPlanet(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  let mat;
  if (texture.basic) {
    mat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(texture.map),
    });
  }
  if (texture.standard) {
    mat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(texture.map),
    });
  }

  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  mesh.position.x = position;

  return { mesh, obj };
}

const mercury = createPlanet(3.2, { standard: true, map: mercuryTexture }, 28);
const venus = createPlanet(5.8, { standard: true, map: venusTexture }, 44);
const earth = createPlanet(6, { standard: true, map: earthTexture }, 62);
const mars = createPlanet(4, { standard: true, map: marsTexture }, 78);
const jupiter = createPlanet(12, { standard: true, map: jupiterTexture }, 100);
const neptune = createPlanet(7, { standard: true, map: neptuneTexture }, 200);
const pluto = createPlanet(2.8, { standard: true, map: plutoTexture }, 216);
const sun = createPlanet(16, { basic: true, map: sunTexture }, 0);
const saturn = createPlanet(10, { standard: true, map: saturnTexture }, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});

const uranus = createPlanet(7, { standard: true, map: uranusTexture }, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});

//PointLight
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

function animate() {
  //Self-ratotion
  sun.mesh.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);  
  saturn.mesh.rotateY(0.038);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  //Around-sun-ratation
  mercury.obj.rotateY(0.03);
  venus.obj.rotateY(0.015);
  earth.obj.rotateY(0.01);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0001);
  pluto.obj.rotateY(0.004);
  render.render(scene, camera);
}

render.setAnimationLoop(animate);

window.addEventListener("resize", (e) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  render.setSize(window.innerWidth, window.innerHeight);
});
