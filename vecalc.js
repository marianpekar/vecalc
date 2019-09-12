const MAX_CAMERA_DISTANCE = 30;
const MIN_CAMERA_DISTANCE = 1;
const LABEL_X_OFFSET = 5;
const AXIS_LENGHT = 10;

let camera, scene, raycaster, renderer, container; 

let vectors = [];
let vectorsNorm = [];

let mouse = new THREE.Vector2(), INTERSECTED;
const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );
let radius = 13, theta = 15;

let args = {
    v1x: 1,
    v1y: 2,
    v1z: 3,
    v2x: 3,
    v2y: 2,
    v2z: 1,
    decimals: 2,
    showAxis: true,
    showNormalized: false
}

let infoPanelDOM = document.getElementById("info-panel");
let v1LabelDOM = document.getElementById("v1-label");
let v2LabelDOM = document.getElementById("v2-label");
let cLabelDOM = document.getElementById("c-label");

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 10000);
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x122232);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    document.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'resize', onResize, false );

    updateCamera();
    draw();
}

function draw() {
    vectors = [];
    clearScene();

    vectors.push(Utils.createVector(args.v1x,args.v1y,args.v1z));
    vectors.push(Utils.createVector(args.v2x,args.v2y,args.v2z));
    vectors.push(Utils.createCrossProduct(vectors[0], vectors[1]));

    if(args.showNormalized) {
        vectorsNorm = [];
        vectorsNorm.push(Utils.normalize(Utils.createVector(args.v1x,args.v1y,args.v1z)));
        vectorsNorm.push(Utils.normalize(Utils.createVector(args.v2x,args.v2y,args.v2z)));
        vectorsNorm.push(Utils.normalize(Utils.createCrossProduct(vectors[0], vectors[1])));
    }

    if(args.showAxis)
        drawAxis();
    
    drawVectors();
    updateInfoPanel();
    updateLabels();
}

function updateLabels() {
    let v1ScreenPos = getScreenPos(new THREE.Vector3(vectors[0].x, vectors[0].y, vectors[0].z));
    let v2ScreenPos = getScreenPos(new THREE.Vector3(vectors[1].x, vectors[1].y, vectors[1].z));
    let cScreenPos = getScreenPos(new THREE.Vector3(vectors[2].x, vectors[2].y, vectors[2].z));

    if(args.showNormalized) {
        v1ScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[0].x, vectorsNorm[0].y, vectorsNorm[0].z));
        v2ScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[1].x, vectorsNorm[1].y, vectorsNorm[1].z));
        cScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[2].x, vectorsNorm[2].y, vectorsNorm[2].z));
    }

    v1LabelDOM.setAttribute('style',`left: ${v1ScreenPos.x + LABEL_X_OFFSET}px; top: ${v1ScreenPos.y}px`);
    v2LabelDOM.setAttribute('style',`left: ${v2ScreenPos.x + LABEL_X_OFFSET}px; top: ${v2ScreenPos.y}px`);
    cLabelDOM.setAttribute('style',`left: ${cScreenPos.x + LABEL_X_OFFSET}px; top: ${cScreenPos.y}px`);

}

function clearScene() {
    while(scene.children.length > 0)
        scene.remove(scene.children[0]); 
}

function drawAxis() {
    addAxis(AXIS_LENGHT,0,0,0xff0000);
    addAxis(0,AXIS_LENGHT,0,0x00ff00);
    addAxis(0,0,AXIS_LENGHT,0x0000ff);
}

function drawVectors() {
    for(let i = 0; i < vectors.length; i++) {
        let geometry = new THREE.Geometry();
        geometry.vertices.push(scene.position);

        if(args.showNormalized)
            geometry.vertices.push(new THREE.Vector3(vectorsNorm[i].x,vectorsNorm[i].y,vectorsNorm[i].z));           
        else
            geometry.vertices.push(new THREE.Vector3(vectors[i].x,vectors[i].y,vectors[i].z));

        let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: vectors[i].color
            }));
        scene.add(line);
    }
}

//pass new THREE.Vector3
function getScreenPos(vector) {
    vector.project(camera);
    vector.x = ( vector.x + 1) * renderer.domElement.width / 2;
    vector.y = - ( vector.y - 1) * renderer.domElement.height / 2;
    vector.z = 0;
    return vector;
}

function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    windowHalf.set( width / 2, height / 2 );

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );

    updateLabels();
}

function onKeyDown( event ) {
    if(event.keyCode == 65 || event.keyCode == 37)
        theta -= 0.5;

    if(event.keyCode == 68 || event.keyCode == 39) 
        theta += 0.5;
    
    if(event.keyCode == 87 || event.keyCode == 38)
        if(radius >= MIN_CAMERA_DISTANCE)
            radius -= 0.1;
    
    if(event.keyCode == 83 || event.keyCode == 40) 
        if(radius <= MAX_CAMERA_DISTANCE)
            radius += 0.1;

    updateLabels();
    updateCamera();
}

function updateCamera() {
    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    camera.lookAt( scene.position );

    camera.updateMatrixWorld();            
}

function addAxis(x,y,z,color) {
    let geometry = new THREE.Geometry();
    
    geometry.vertices.push(new THREE.Vector3(x,y,z));
    geometry.vertices.push(new THREE.Vector3(-x,-y,-z));
    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: color,
        linewidth: 2}));
    scene.add(line);
}      

function animate() {
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
}

function updateInfoPanel() {
    let angle = Utils.calculageAngle(vectors[0],vectors[1]);

    let angleV1x = Utils.calculageAngle(vectors[0],Utils.createVector(1,0,0));
    let angleV1y = Utils.calculageAngle(vectors[0],Utils.createVector(0,1,0));
    let angleV1z = Utils.calculageAngle(vectors[0],Utils.createVector(0,0,1));

    let angleV2x = Utils.calculageAngle(vectors[1],Utils.createVector(1,0,0));
    let angleV2y = Utils.calculageAngle(vectors[1],Utils.createVector(0,1,0));
    let angleV2z = Utils.calculageAngle(vectors[1],Utils.createVector(0,0,1));

    let angleCx = Utils.calculageAngle(vectors[2],Utils.createVector(1,0,0));
    let angleCy = Utils.calculageAngle(vectors[2],Utils.createVector(0,1,0));
    let angleCz = Utils.calculageAngle(vectors[2],Utils.createVector(0,0,1));

    infoPanelDOM.innerText = `v1 = ${vectors[0].x.toFixed(args.decimals)}i + ${vectors[0].y.toFixed(args.decimals)}j + ${vectors[0].z.toFixed(args.decimals)}k
    v2 = ${vectors[1].x.toFixed(args.decimals)}i + ${vectors[1].y.toFixed(args.decimals)}j + ${vectors[1].z.toFixed(args.decimals)}k

    | v1 | = ${Utils.calculateVectorLenght(vectors[0]).toFixed(args.decimals)}
    | v2 | = ${Utils.calculateVectorLenght(vectors[1]).toFixed(args.decimals)}
    | c | = ${Utils.calculateVectorLenght(vectors[2]).toFixed(args.decimals)}
    
    c = v1 ✕ v2 = ${vectors[2].x.toFixed(args.decimals)}i + ${vectors[2].y.toFixed(args.decimals)}j + ${vectors[2].z.toFixed(args.decimals)}k
    v1 • v2 = ${Utils.calculateDotProduct(vectors[0],vectors[1]).toFixed(args.decimals)}

    v1 ∠ v2 = ${(angle * 180 / Math.PI).toFixed(args.decimals)}° (${angle.toFixed(args.decimals)} rad)

    v1 ∠ X = ${(angleV1x * 180 / Math.PI).toFixed(args.decimals)}° (${angleV1x.toFixed(args.decimals)} rad)
    v1 ∠ Y = ${(angleV1y * 180 / Math.PI).toFixed(args.decimals)}° (${angleV1y.toFixed(args.decimals)} rad)
    v1 ∠ Z = ${(angleV1z * 180 / Math.PI).toFixed(args.decimals)}° (${angleV1z.toFixed(args.decimals)} rad)

    v2 ∠ X = ${(angleV2x * 180 / Math.PI).toFixed(args.decimals)}° (${angleV2x.toFixed(args.decimals)} rad)
    v2 ∠ Y = ${(angleV2y * 180 / Math.PI).toFixed(args.decimals)}° (${angleV2y.toFixed(args.decimals)} rad)
    v2 ∠ Z = ${(angleV2z * 180 / Math.PI).toFixed(args.decimals)}° (${angleV2z.toFixed(args.decimals)} rad)

    c ∠ X = ${(angleCx * 180 / Math.PI).toFixed(args.decimals)}° (${angleCx.toFixed(args.decimals)} rad)
    c ∠ Y = ${(angleCy * 180 / Math.PI).toFixed(args.decimals)}° (${angleCy.toFixed(args.decimals)} rad)
    c ∠ Z = ${(angleCz * 180 / Math.PI).toFixed(args.decimals)}° (${angleCz.toFixed(args.decimals)} rad)
    `;
}   