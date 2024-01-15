import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Clase Prisma
class PrismGeometry extends THREE.ExtrudeGeometry {
  constructor(vertices, height) {
    super(new THREE.Shape(vertices), {depth: height, bevelEnabled: false});
  }
}

let camera, scene, renderer;
let a = -3000;

let particleLight;
let group;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 0.25, 50 );
    camera.position.z = 10;
    camera.position.y = 3;

    scene = new THREE.Scene();

    group = new THREE.Group();
    scene.add( group );

    // LIGHTS
    particleLight = new THREE.Mesh(
        new THREE.SphereGeometry( .05, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    scene.add( particleLight );
    var light = new THREE.DirectionalLight( 0xffffff, 4 );
    light.castShadow = true;
    // particleLight.add( new THREE.PointLight( 0xffffff, 90 ) );
    particleLight.add (light);
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled= true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var light2 = new THREE.AmbientLight(0xffffff,1);
    group.add(light2);

    // Terraza
    geometry = new THREE.BoxGeometry(2.3,0.05,2.3);
    geometry.translate(-0.15,-1.4,0.9);
    const textureCemento = new THREE.TextureLoader().load('textures/cemento.jpg' );
    textureCemento.wrapS = THREE.RepeatWrapping;
    textureCemento.wrapT = THREE.RepeatWrapping;
    textureCemento.repeat.x = 4;
    textureCemento.repeat.y = 4;
    textureCemento.repeat.z = 4;
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);
    
    // 1er piso
    geometry = new THREE.BoxGeometry(1.9,0.2,1.9);
    geometry.translate(-0.15,-1.5,0.85);
    material = new THREE.MeshToonMaterial( { color: 0x00278 } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    // Planta baja central
    geometry = new THREE.BoxGeometry(1.1,0.2,0.8); 
    geometry.translate(0.13,-1.7,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xaa0078 } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.4,0.2,0.8); // Planta baja izq
    geometry.translate(-0.78,-1.7,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xffffff } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(1.9,0.2,0.46); // Planta baja fondo
    geometry.translate(-0.15,-1.7,0.13);
    material = new THREE.MeshToonMaterial( { color: 0x00bc78 } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.ConeGeometry(0.45,0.15,3,1) // Tragaluz
    geometry.translate(-0.85,-1.3,0.85);
    const textureVidrio2 = new THREE.TextureLoader().load('textures/glass2.jpg' );
    textureVidrio2.wrapS = THREE.RepeatWrapping;
    textureVidrio2.wrapT = THREE.RepeatWrapping;
    textureVidrio2.repeat.x = 4;
    material = new THREE.MeshToonMaterial( { color: 0x3dd3eb, map: textureVidrio2 } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.7,0.01,0.55); // Piscina
    geometry.translate(-0.65,-1.37,1.6);
    material = new THREE.MeshToonMaterial( { color: 0xff110 } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    // Pilares
    var pillarVertices = new Float32Array( [ 
        0.0, 0.0,  0.05, // v0
        0.1, 0.0,  0.0, // v1
        0.1, 0.4,  0.0, // v2
        0.0, 0.4,  0.05, // v3
        -0.05, 0.2, 0.075, // v4
        0.0, 0.0,  -0.05, // v5 = v0 backside
        0.0, 0.4,  -0.05, // v6 = v3 backside
        -0.05, 0.2, -0.075, // v7 = v4 backside
    ] );

    // regla de la mano derecha
    var indices = [
        // front
        0, 1, 2,
        2, 3, 0,
        0, 3, 4,

        // back
        1, 5, 2,
        6, 2, 5,
        6, 5, 7,

        // bottom lid
        1, 0, 5,

        // top lid
        3, 2, 6,

        // side top cover
        5, 0, 4,
        5, 4, 7,

        // side bottom cover
        3, 6, 4,
        4, 6, 7,
    ];

    var pillarGeometry = new THREE.BufferGeometry();
    pillarGeometry.setIndex(indices);
    pillarGeometry.setAttribute('position',new THREE.BufferAttribute(pillarVertices, 3));
    
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var mesh = new THREE.Mesh(pillarGeometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    
    // Translate, rotate y group.add las veces que se repita el pilar
    pillarGeometry.rotateY(-Math.PI / 2);
    pillarGeometry.translate(0.7, -1.8, 1.85);
    // group.add(mesh);

    var pilares = new THREE.Group();
    pilares.add(mesh);
    for (let i = 0; i<6; i++){
        var mesh2 = mesh.clone();
        mesh2.translateX(-i/3);
        // group.add(mesh2);
        pilares.add(mesh2);
    }
    var pilarLadoDer = pilares.clone();
    pilarLadoDer.rotateY(Math.PI/2);
    pilarLadoDer.translateX(-0.75);
    pilarLadoDer.translateZ(-1);
    pilares.add(pilarLadoDer);
    
    var pilarAtras = pilarLadoDer.clone();
    pilarAtras.rotateY(Math.PI/2);
    pilarAtras.translateX(-0.75);
    pilarAtras.translateZ(-0.95);
    pilares.add(pilarAtras);

    var pilarLadoIzq = pilarAtras.clone();
    pilarLadoIzq.rotateY(Math.PI/2);
    pilarLadoIzq.translateX(-0.75);
    pilarLadoIzq.translateZ(-0.95);
    pilares.add(pilarLadoIzq);
    
    scene.add(pilares);


    // Edificio de Habitaciones (Prisma Triangular)
    // Bases Habitaciones
    var A = new THREE.Vector3( 0, 0.9, 0.2);
    var B = new THREE.Vector3( 0.5, 0, 0.2 );
    var C = new THREE.Vector3( -0.5, 0, 0.2 );
    var height = 0.15;                   
    var geometry = new PrismGeometry( [ A, B, C ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.25,1.25,1.25);
    geometry.translate(0.1,-1.05,0.15);
    // geometry.rotateY(Math.PI)
    var material = new THREE.MeshToonMaterial( { color: 0xFFBF00 } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add( cube );

    var A = new THREE.Vector3( 0.2, 0.7, 0.2);
    var B = new THREE.Vector3( 0.5, 0, 0.2 );
    var C = new THREE.Vector3( -0.5, 0, 0.2 );
    var D = new THREE.Vector3(-0.2,0.7,0.2);
    var height = 0.16;                   
    var geometry = new PrismGeometry( [ A, B, C, D ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    // geometry.scale(1.05,1.05,1.05);
    geometry.translate(0.1,-1.2,0.17);
    var material = new THREE.MeshToonMaterial( { color: 0x3b5178, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add( cube );

    var geometry = new THREE.BoxGeometry(0.4,0.35,0.1); // Base rectangular de atras
    geometry.translate(0.1,-1.23,0.15);
    material = new THREE.MeshToonMaterial( { color: 0x3b5178, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    // Pilares de Habitaciones
    
    var pilaresH = new THREE.Group();
    var pilar = new THREE.BufferGeometry();
    pilar.setIndex(indices);
    pilar.setAttribute('position',new THREE.BufferAttribute(pillarVertices, 3));
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var meshH = new THREE.Mesh(pilar, material);
    meshH.receiveShadow = true;
    meshH.castShadow = true;
    pilaresH.scale.set(0.8, 0.8,0.8);
    pilaresH.rotateY(1.064);
    pilaresH.position.set(-1.43, 0.062,1.05);
    pilaresH.add(meshH);

    for (let i = 0; i<5; i++){
        var mesh2 = meshH.clone();
        mesh2.translateX(2*i/5);
        pilaresH.add(mesh2);
    }
    
    for (let i = 0; i<5; i++){
        var mesh2 = meshH.clone();
        mesh2.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI);
        mesh2.rotateY(1.0136);
        mesh2.translateZ(-3.34);
        mesh2.translateX(0.43);
        mesh2.translateX(-2*i/5);
        pilaresH.add(mesh2);
    }

    for (let i = 0; i<5; i++){
        var mesh2 = meshH.clone();
        mesh2.rotateY(Math.PI);
        mesh2.rotateY(-1.064);
        mesh2.translateX(-3.4);
        mesh2.translateZ(-0.7);
        if (i == 2) continue;
        mesh2.translateX(2*i/5);
        pilaresH.add(mesh2);
    }
    scene.add(pilaresH);

    // Un piso
    var piso = new THREE.Group();
    // Parte Ventana
    var A1 = new THREE.Vector3(0.1, 0.833, 0.2 );
    var A2 = new THREE.Vector3(-0.1, 0.833,0.2 );
    var B1 = new THREE.Vector3(0.5,0.167, 0.2 );
    var B2 = new THREE.Vector3(0.4, 0, 0.2 );
    var C1 = new THREE.Vector3(-0.5, 0.167, 0.2 );
    var C2 = new THREE.Vector3(-0.4 ,0, 0.2 );
    var height = 0.1;                   
    var geometry = new PrismGeometry( [ A1, B1,B2,C2,C1,A2 ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.35,1.35,1.35);
    geometry.translate(2.1,0.29,0.1);
    const textureVentanas = new THREE.TextureLoader().load('textures/test_ventanas.jpg' );
    textureVentanas.wrapS = THREE.RepeatWrapping;
    textureVentanas.wrapT = THREE.RepeatWrapping;
    textureVentanas.repeat.x = 7;
    textureVentanas.repeat.y = 4;
    textureVentanas.repeat.z = 4;
    // clearcoat: 1.0,
    // clearcoatRoughness: 0.1,
    // metalness: 0.9,
    // roughness: 0.5,
    // color: 0x0000ff,
    // normalMap: normalMap3,
    var material = new THREE.MeshToonMaterial( { color: 0x757980, map: textureVentanas } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    piso.add( cube );

    // Parte piso y balconcitos
    var A = new THREE.Vector3( 0, 1, 0.2);
    var B = new THREE.Vector3( 0.6, 0, 0.2 );
    var C = new THREE.Vector3( -0.6, 0, 0.2 );
    var height = 0.02;                   
    var geometry = new PrismGeometry( [ A1, B, C,A2 ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.35,1.35,1.35);
    geometry.translate(2.1,0.155,0.1);
    // geometry.rotateY(Math.PI)
    var material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    piso.add( cube );

    // Punta de vidrio
    var A = new THREE.Vector3( 0, 1, 0.2);
    var height = 0.112;                   
    var geometry = new PrismGeometry( [ A, A1,A2 ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.35,1.35,1.35);
    geometry.translate(2.1,0.29,0.1);
    // geometry.rotateY(Math.PI)
    const textureVidrio = new THREE.TextureLoader().load('textures/glass.jpg' );
    textureVidrio.wrapS = THREE.RepeatWrapping;
    textureVidrio.wrapT = THREE.RepeatWrapping;
    textureVidrio.repeat.x = 7;
    textureVidrio.repeat.y = 4;
    textureVidrio.repeat.z = 4;
    var material = new THREE.MeshToonMaterial( { color: 0x3dd3eb, map: textureVidrio } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    piso.add( cube );

    var geometry = new THREE.BoxGeometry(0.4,0.165,0.05); // Parte rectangular de atras
    geometry.translate(2.1,0.207,0.1);
    material = new THREE.MeshToonMaterial( { color: 0x3b5178, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    piso.add(cube);

    // Mutiplicar pisos
    piso.position.set(-2,-1.19,-0.01)
    var pisos = new THREE.Group();
    pisos.add(piso);

    for (let i =0 ; i<9; i++){
        var piso2 = piso.clone();
        piso2.translateY(i*0.15);
        pisos.add(piso2);
    }
    scene.add(pisos);

    // Techo
    var A = new THREE.Vector3( 0, 1, 0.2);
    var B = new THREE.Vector3( 0.6, 0, 0.2 );
    var C = new THREE.Vector3( -0.6, 0, 0.2 );
    var height = 0.03;                   
    var geometry = new PrismGeometry( [ A, B, C], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.35,1.35,1.35);
    geometry.translate(0.1,0.342,0.1);
    var material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    var cube2 = cube.clone();
    cube2.translateY(0.14);
    group.add( cube );
    group.add( cube2 );

    var A = new THREE.Vector3( 0, 1, 0.2);
    var B = new THREE.Vector3( 0.6, 0, 0.2 );
    var C = new THREE.Vector3( -0.6, 0, 0.2 );
    var height = 0.12;                   
    var geometry = new PrismGeometry( [ A, B, C], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2)
    geometry.scale(1,1,1);
    geometry.translate(0.1,0.45,0.2);
    var material = new THREE.MeshToonMaterial( { color: 0xe6e047 } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube)

    // Calle
    geometry = new THREE.BoxGeometry(5,0.00001,5);
    geometry.translate(-0.15,-1.81,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xed7621 } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    // cube.castShadow = true;
    group.add(cube);

    // EVENTS

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 3;
    controls.maxDistance = 30;

    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

}

function animate() {

    requestAnimationFrame( animate );

    render();

    // stats.update();

}

function render() {

    var timer = a * 0.00025;
    particleLight.position.x = 17 * Math.sin( timer * 2 );
    particleLight.position.y = 17 * Math.cos( timer * 2 );
    a+= 1;
    if (a >= 3000){
        a = a*-1;
    }
    // for ( let i = 0; i < group.children.length; i ++ ) {

    //     const child = group.children[ i ];
    //     child.rotation.y += 0.005;

    // }

    renderer.render( scene, camera );

}

