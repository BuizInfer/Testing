import * as THREE from './threejs/three.module.js';
import { STLLoader } from './threejs/STLLoader.js';
//import { OrbitControls } from './threejs/OrbitControls.js';

var container, stats, plane;

let scene, camera, renderer, object;

function init() {
    //scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xffffff);

    //camera = new THREE.PerspectiveCamera(
    //    75,
    //    window.innerWidth / window.innerHeight,
    //    0.1,
    //    10000
    //);
    //camera.position.z = 10;

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 15);
    camera.position.set(3, 0.5, 3);

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xffffff, 2, 15);
    scene.background = new THREE.Color(0xffffff);

    // Grid

    var size = 20, step = 0.25;

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({ color: 0xffffff });

    for (var i = - size; i <= size; i += step) {

        geometry.vertices.push(new THREE.Vector3(- size, - 0.04, i));
        geometry.vertices.push(new THREE.Vector3(size, - 0.04, i));

        geometry.vertices.push(new THREE.Vector3(i, - 0.04, - size));
        geometry.vertices.push(new THREE.Vector3(i, - 0.04, size));

    }
    var line = new THREE.LineSegments(geometry, material);
    //var line = new THREE.Line(geometry, material, THREE.LinePieces);
    line.position.y = -0.46;
    scene.add(line);

    // Ground

    plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 }));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    scene.add(plane);

    plane.receiveShadow = true;

    // Light

    scene.add(new THREE.AmbientLight(0xffffff));

    addShadowedLight(1, 1, 1, 0xffffff, 1.35);
    addShadowedLight(0.5, 1, -1, 0xffffff, 1);

    // Render

    renderer = new THREE.WebGLRenderer();
    //Tamano del recuadro de visualizacion 3D
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(object);

    // Control
    //let control = new OrbitControls(camera, renderer.domElement);
    //control.minDistance = 1;
    //control.maxDistance = 15;

    //document.addEventListener('wheel', onDocumentMouseWheel, false);

    //function onDocumentMouseWheel(event) {
    //    camera.zoom += event.deltaY * 0.001;
    //    camera.zoom = Math.max(0.5, Math.min(2, camera.zoom));
    //    camera.updateProjectionMatrix();
    //}
    
    // Control
    // Permite elc control con el cursor de la pieza
    //let control = new OrbitControls(camera, renderer.domElement);
    //Zoom relativo en angulo Y
    //control.minDistance = 1;
    //control.maxDistance = 2;


    animate();
}


function addShadowedLight(x, y, z, color, intensity) {

    var directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z)
    scene.add(directionalLight);

    directionalLight.castShadow = true;
    //directionalLight.shadowCameraVisible = true;

    var d = 1;
    //directionalLight.shadowCameraLeft = -d;
    //directionalLight.shadowCameraRight = d;
    //directionalLight.shadowCameraTop = d;
    //directionalLight.shadowCameraBottom = -d;

    //directionalLight.shadowCameraNear = 1;
    //directionalLight.shadowCameraFar = 4;

    //directionalLight.shadowMapWidth = 2048;
    //directionalLight.shadowMapHeight = 2048;

    //directionalLight.shadowBias = -0.005;
    //directionalLight.shadowDarkness = 0.15;

}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    render();
}

function calcularCentroDelModelo(model) {
    var boundingBox = new THREE.Box3().setFromObject(model);
    var centro = new THREE.Vector3();
    boundingBox.getCenter(centro);
    return centro;
}


function render() {

    var timer = Date.now() * 0.0005;

    camera.position.x = Math.cos(timer) * 5;
    camera.position.z = Math.sin(timer) * 5;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}

let loader = new STLLoader();
loader.load('/example5.stl', (model) => {
    object = new THREE.Mesh(
        model,
        new THREE.MeshLambertMaterial({ color: 0x5e6160 })
    );
    object.scale.set(0.001, 0.001, 0.001);
    object.rotation.x = -Math.PI / 2;
    //
    // Calcular el centro del modelo
    var centroDelModelo = calcularCentroDelModelo(object);

    // Posicionar el objeto en el centro del plano
    object.position.set(-centroDelModelo.x, -centroDelModelo.y, -centroDelModelo.z);

    // Ajustar la posición del plano
    //plane.position.set(-centroDelModelo.x, -0.5, -centroDelModelo.z);
    //

    //object.position.set(0, 0, 0);


    //object.position.set(-0.5, -0.4, 0);
    //object.rotation.x = -Math.PI / 2.8;

    init();
});


