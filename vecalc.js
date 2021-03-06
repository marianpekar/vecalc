const MIN_CAMERA_DISTANCE = 1;
const LABEL_X_OFFSET = 5;
const AXIS_LENGHT = 10;

const GRID_SIZE = 20;
const GRID_DIVISION = 20;
const AXIS_OFFSET = 0.0001; // to construct axis with two lines close to each other and avoid overlap with grid 

const ZERO = 0;
const RIGHT_ANGLE_RAD = 90 * Math.PI / 180;
const RIGHT_ANGLE_CC_RAD = 270 * Math.PI / 180;

let camera, scene, raycaster, renderer, container, controls;

let vectors = [];
let vectorsNorm = [];

const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

let args = {
    v1x: 1,
    v1y: 2,
    v1z: 3,
    v2x: 3,
    v2y: 2,
    v2z: 1,
    t: 1,
    u: 1,
    decimals: 2,
    showAxis: true,
    showGrid: false,
    showNormalized: false,
    anglesInRad: false,
    showResults: true,
    showV1crossV2: true,
    showV2crossV1: false,
    showV1plusV2: true,
    showV1minusV2: true,
    showV2minusV1: false
}

// DOMs live here
let v1LabelDOM = document.getElementById("v1-label");
let v2LabelDOM = document.getElementById("v2-label");

let aLabelDOM = document.getElementById("a-label");
let bLabelDOM = document.getElementById("b-label");
let bCommaLabelDOM = document.getElementById("b-comma-label")

let cLabelDOM = document.getElementById("c-label");
let cCommaLabelDOM = document.getElementById("c-comma-label");

let resultsDOM = document.getElementById("results");
    let infoPanelDOM = document.getElementById("info-panel");
    let tableOfAnglesDOM = document.getElementById("table-of-angles");
// ---

init();
draw();
animate();
updateLabels();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x122232);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(5,5,10);  

    controls = new THREE.OrbitControls( camera, renderer.domElement ); 
    controls.minDistance = MIN_CAMERA_DISTANCE;

    window.addEventListener( 'resize', onResize, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'mousemove', onMouseMove, false );
    renderer.domElement.addEventListener( 'touchmove', onTouchMove, false );
    renderer.domElement.addEventListener( 'wheel', onWheel, false);
}

function draw() {
    vectors = [];
    clearScene();

    vectors.push(Utils.createVector(args.v1x * args.t, args.v1y * args.t, args.v1z * args.t)); // 0 = v1
    vectors.push(Utils.createVector(args.v2x * args.u, args.v2y * args.u, args.v2z * args.u)); // 1 = v2
    vectors.push(Utils.createCrossProduct(vectors[0], vectors[1])); // 2 = v1 x v2
    vectors.push(Utils.add(vectors[0], vectors[1])); // 3 = v1 + v2
    vectors.push(Utils.subtract(vectors[0], vectors[1])); // 4 = v1 - v2
    vectors.push(Utils.subtract(vectors[1], vectors[0])); // 5 = v2 - v1
    vectors.push(Utils.createCrossProduct(vectors[1],vectors[0])) // 6 = v2 x v1

    if(args.showNormalized) {
        vectorsNorm = [];
        vectorsNorm.push(Utils.normalize(Utils.createVector(args.v1x * args.t, args.v1y * args.t, args.v1z * args.t)));
        vectorsNorm.push(Utils.normalize(Utils.createVector(args.v2x * args.u, args.v2y * args.u, args.v2z * args.u)));
        vectorsNorm.push(Utils.normalize(Utils.createCrossProduct(vectors[0], vectors[1])));
        vectorsNorm.push(Utils.normalize(Utils.add(vectors[0], vectors[1])));
        vectorsNorm.push(Utils.normalize(Utils.subtract(vectors[0], vectors[1])));
        vectorsNorm.push(Utils.normalize(Utils.subtract(vectors[1], vectors[0])));
        vectorsNorm.push(Utils.normalize(Utils.createCrossProduct(vectors[1], vectors[0])));
    }

    if(args.showAxis)
        drawAxis();
    
    if(args.showGrid)
        drawGrid();
    
    drawVectors();
    updateLabels();

    updateResults();
}

function updateResults() {
    if(!args.showResults) {
        resultsDOM.style.visibility = "hidden";
        return;
    }

    resultsDOM.style.visibility = "visible";

    updateInfoPanel();
    updateTableOfAngles();
}

function drawGrid() {
    let grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISION);
    grid.colorCenterLine = new THREE.Color(0x00ff00);
    scene.add(grid);
}

function updateLabels() {
    let v1ScreenPos = getScreenPos(new THREE.Vector3(vectors[0].x, vectors[0].y, vectors[0].z));
    let v2ScreenPos = getScreenPos(new THREE.Vector3(vectors[1].x, vectors[1].y, vectors[1].z));
    
    let aScreenPos = getScreenPos(new THREE.Vector3(vectors[3].x, vectors[3].y, vectors[3].z));
    let bScreenPos = getScreenPos(new THREE.Vector3(vectors[4].x, vectors[4].y, vectors[4].z));
    let bCommaScreenPos = getScreenPos(new THREE.Vector3(vectors[5].x, vectors[5].y, vectors[5].z));

    let cScreenPos = getScreenPos(new THREE.Vector3(vectors[2].x, vectors[2].y, vectors[2].z));
    let cCommaScreenPos = getScreenPos(new THREE.Vector3(vectors[6].x, vectors[6].y, vectors[6].z));

    if(args.showNormalized) {
        v1ScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[0].x, vectorsNorm[0].y, vectorsNorm[0].z));
        v2ScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[1].x, vectorsNorm[1].y, vectorsNorm[1].z));

        aScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[3].x, vectorsNorm[3].y, vectorsNorm[3].z));
        bScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[4].x, vectorsNorm[4].y, vectorsNorm[4].z));
        bCommaScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[5].x, vectorsNorm[5].y, vectorsNorm[5].z));

        cScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[2].x, vectorsNorm[2].y, vectorsNorm[2].z));
        cCommaScreenPos = getScreenPos(new THREE.Vector3(vectorsNorm[6].x, vectorsNorm[6].y, vectorsNorm[6].z));    
    }

    v1LabelDOM.setAttribute('style',`left: ${v1ScreenPos.x + LABEL_X_OFFSET}px; top: ${v1ScreenPos.y}px`);
    v2LabelDOM.setAttribute('style',`left: ${v2ScreenPos.x + LABEL_X_OFFSET}px; top: ${v2ScreenPos.y}px`);

    aLabelDOM.setAttribute('style',`left: ${aScreenPos.x + LABEL_X_OFFSET}px; top: ${aScreenPos.y}px`);
    bLabelDOM.setAttribute('style',`left: ${bScreenPos.x + LABEL_X_OFFSET}px; top: ${bScreenPos.y}px`);
    bCommaLabelDOM.setAttribute('style',`left: ${bCommaScreenPos.x + LABEL_X_OFFSET}px; top: ${bCommaScreenPos.y}px`);

    cLabelDOM.setAttribute('style',`left: ${cScreenPos.x + LABEL_X_OFFSET}px; top: ${cScreenPos.y}px`);
    cCommaLabelDOM.setAttribute('style',`left: ${cCommaScreenPos.x + LABEL_X_OFFSET}px; top: ${cCommaScreenPos.y}px`);

    let t = args.t != 1 ? "t" : "";
    let u = args.u != 1 ? "u" : "";

    v1LabelDOM.innerText = `v1${t}`;
    v2LabelDOM.innerText = `v2${u}`;

    updateLabelsVisibility();
}

function updateLabelsVisibility() {
    if(!args.showV1plusV2) aLabelDOM.style.visibility = "hidden"; else aLabelDOM.style.visibility = "visible";
    if(!args.showV1minusV2) bLabelDOM.style.visibility = "hidden"; else bLabelDOM.style.visibility = "visible"; 
    if(!args.showV2minusV1) bCommaLabelDOM.style.visibility = "hidden"; else bCommaLabelDOM.style.visibility = "visible";  
    if(!args.showV1crossV2) cLabelDOM.style.visibility = "hidden"; else cLabelDOM.style.visibility = "visible";
    if(!args.showV2crossV1) cCommaLabelDOM.style.visibility = "hidden"; else cCommaLabelDOM.style.visibility = "visible";
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

        if(i == 2 && !args.showV1crossV2) continue;
        if(i == 3 && !args.showV1plusV2) continue;
        if(i == 4 && !args.showV1minusV2) continue;
        if(i == 5 && !args.showV2minusV1) continue;
        if(i == 6 && !args.showV2crossV1) continue;

        let geometry = new THREE.Geometry();
        geometry.vertices.push(scene.position);

        if(args.showNormalized)
            geometry.vertices.push(new THREE.Vector3(vectorsNorm[i].x,vectorsNorm[i].y,vectorsNorm[i].z));           
        else
            geometry.vertices.push(new THREE.Vector3(vectors[i].x,vectors[i].y,vectors[i].z));

        let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: vectors[i].color,
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
    renderer.setSize( width, height );

    updateLabels();
}

function onKeyDown() {
    updateLabels();
}

function onMouseMove() {
    updateLabels();
}

function onWheel() {
    updateLabels();
}

function onTouchMove() {
    updateLabels();
}


function addAxis(x,y,z,color) {
    let geometry = new THREE.Geometry();
    
    geometry.vertices.push(new THREE.Vector3(x + AXIS_OFFSET, y + AXIS_OFFSET,z + AXIS_OFFSET));
    geometry.vertices.push(new THREE.Vector3(-x + AXIS_OFFSET, -y + AXIS_OFFSET,-z + AXIS_OFFSET));

    geometry.vertices.push(new THREE.Vector3(x - AXIS_OFFSET, y - AXIS_OFFSET,z - AXIS_OFFSET));
    geometry.vertices.push(new THREE.Vector3(-x - AXIS_OFFSET, -y - AXIS_OFFSET,-z - AXIS_OFFSET));

    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: color}));
    scene.add(line);
}      

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render( scene, camera );
}

function updateInfoPanel() {
    let t = args.t != 1 ? args.t.toFixed(args.decimals) : "";
    let u = args.u != 1 ? args.u.toFixed(args.decimals) : "";

    infoPanelDOM.innerText = `${t}v1 = ${vectors[0].x.toFixed(args.decimals)}i + ${vectors[0].y.toFixed(args.decimals)}j + ${vectors[0].z.toFixed(args.decimals)}k
    ${u}v2 = ${vectors[1].x.toFixed(args.decimals)}i + ${vectors[1].y.toFixed(args.decimals)}j + ${vectors[1].z.toFixed(args.decimals)}k

    a = ${t}v1 + ${u}v2 = ${vectors[3].x.toFixed(args.decimals)}i + ${vectors[3].y.toFixed(args.decimals)}j + ${vectors[3].z.toFixed(args.decimals)}k
    b = ${t}v1 - ${u}v2 = ${vectors[4].x.toFixed(args.decimals)}i + ${vectors[4].y.toFixed(args.decimals)}j + ${vectors[4].z.toFixed(args.decimals)}k
    b' = ${u}v2 - ${t}v1 = ${vectors[5].x.toFixed(args.decimals)}i + ${vectors[5].y.toFixed(args.decimals)}j + ${vectors[5].z.toFixed(args.decimals)}k

    c = ${t}v1 ✕ ${u}v2 = ${vectors[2].x.toFixed(args.decimals)}i + ${vectors[2].y.toFixed(args.decimals)}j + ${vectors[2].z.toFixed(args.decimals)}k
    c' = ${u}v2 ✕ ${t}v1 = ${vectors[6].x.toFixed(args.decimals)}i + ${vectors[6].y.toFixed(args.decimals)}j + ${vectors[6].z.toFixed(args.decimals)}k
    
    ${t}v1 • ${u}v2 = ${u}v2 • ${t}v1 = ${Utils.calculateDotProduct(vectors[0],vectors[1]).toFixed(args.decimals)}

    | ${t}v1 | = ${Utils.calculateVectorLenght(vectors[0]).toFixed(args.decimals)}
    | ${u}v2 | = ${Utils.calculateVectorLenght(vectors[1]).toFixed(args.decimals)}
    | a | = ${Utils.calculateVectorLenght(vectors[3]).toFixed(args.decimals)}
    | b | = | b' | = ${Utils.calculateVectorLenght(vectors[4]).toFixed(args.decimals)}
    | c | = | c' | = ${Utils.calculateVectorLenght(vectors[2]).toFixed(args.decimals)}
    ` ;
}   

function updateTableOfAngles() {
    let angleV1V2 = Utils.calculageAngle(vectors[0],vectors[1]);

    let angleV1x = Utils.calculageAngle(vectors[0],Utils.createVector(1,0,0));
    let angleV1y = Utils.calculageAngle(vectors[0],Utils.createVector(0,1,0));
    let angleV1z = Utils.calculageAngle(vectors[0],Utils.createVector(0,0,1));

    let angleV2x = Utils.calculageAngle(vectors[1],Utils.createVector(1,0,0));
    let angleV2y = Utils.calculageAngle(vectors[1],Utils.createVector(0,1,0));
    let angleV2z = Utils.calculageAngle(vectors[1],Utils.createVector(0,0,1));

    let angleCx = Utils.calculageAngle(vectors[2],Utils.createVector(1,0,0));
    let angleCy = Utils.calculageAngle(vectors[2],Utils.createVector(0,1,0));
    let angleCz = Utils.calculageAngle(vectors[2],Utils.createVector(0,0,1));

    let angleAx = Utils.calculageAngle(vectors[3],Utils.createVector(1,0,0));
    let angleAy = Utils.calculageAngle(vectors[3],Utils.createVector(0,1,0));
    let angleAz = Utils.calculageAngle(vectors[3],Utils.createVector(0,0,1));

    let angleBx = Utils.calculageAngle(vectors[4],Utils.createVector(1,0,0));
    let angleBy = Utils.calculageAngle(vectors[4],Utils.createVector(0,1,0));
    let angleBz = Utils.calculageAngle(vectors[4],Utils.createVector(0,0,1));

    let angleBCommaX = Utils.calculageAngle(vectors[5],Utils.createVector(1,0,0));
    let angleBCommaY = Utils.calculageAngle(vectors[5],Utils.createVector(0,1,0));
    let angleBCommaZ = Utils.calculageAngle(vectors[5],Utils.createVector(0,0,1));

    let angleCCommaX = Utils.calculageAngle(vectors[6],Utils.createVector(1,0,0));
    let angleCCommaY = Utils.calculageAngle(vectors[6],Utils.createVector(0,1,0));
    let angleCCommaZ = Utils.calculageAngle(vectors[6],Utils.createVector(0,0,1));

    let angleV1a = Utils.calculageAngle(vectors[0],vectors[3]);
    let angleV1b = Utils.calculageAngle(vectors[0],vectors[4]);
    let angleV1bComma = Utils.calculageAngle(vectors[0],vectors[5]);

    let angleV2a = Utils.calculageAngle(vectors[1],vectors[3]);
    let angleV2b = Utils.calculageAngle(vectors[1],vectors[4]);
    let angleV2bComma = Utils.calculageAngle(vectors[1],vectors[5]);

    let angleAb = Utils.calculageAngle(vectors[3],vectors[4]);
    let angleAbComma = Utils.calculageAngle(vectors[3],vectors[5]);

    let degToRadSwitch = args.anglesInRad ? 1 : 180 / Math.PI;

    let t = args.t != 1 ? args.t.toFixed(args.decimals) : "";
    let u = args.u != 1 ? args.u.toFixed(args.decimals) : "";

    tableOfAnglesDOM.innerHTML = `   
    <tr>
        <td>∠ ${args.anglesInRad ? "rad" : "°"}</td>
        <td> ${t}v1 </td>
        <td> ${u}v2 </td>
        <td> a </td>
        <td> b </td>
        <td> b' </td>
        <td> c </td>
        <td> c' </td>
        <td> X </td>
        <td> Y </td>
        <td> Z </td>
    <tr>
    <tr>
        <td> ${t}v1 </td>
        <td> ${ZERO.toFixed(args.decimals)}</td>
        <td> ${(angleV1V2 * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV1a * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV1b * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV1bComma * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV1x * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV1y * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV1z * degToRadSwitch).toFixed(args.decimals)}</td>
    </tr>
    <tr>
        <td> ${u}v2 </td>
        <td> ${(angleV1V2 * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${ZERO.toFixed(args.decimals)}</td>
        <td> ${(angleV2a * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV2b * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV2bComma * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV2x * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV2y * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV2z * degToRadSwitch).toFixed(args.decimals)}</td>
    </tr>
    <tr>
        <td> a </td>
        <td> ${(angleV1a * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV2a * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${ZERO.toFixed(args.decimals)}</td>
        <td> ${(angleAb * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleAbComma * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleAx * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleAy * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleAz * degToRadSwitch).toFixed(args.decimals)}</td>
    <tr>
    <tr>
        <td> b </td>
        <td> ${(angleV1b * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV2b * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleAb * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${ZERO.toFixed(args.decimals)}</td>
        <td> ${(Math.PI * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleBx * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleBy * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleBz * degToRadSwitch).toFixed(args.decimals)}</td>
    </tr>
    <tr>
        <td> b' </td>
        <td> ${(angleV1bComma * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleV2bComma * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleAbComma * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(Math.PI * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${ZERO.toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleBCommaX * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleBCommaY * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleBCommaZ * degToRadSwitch).toFixed(args.decimals)}</td>
    </tr>
    <tr>
        <td> c </td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${ZERO.toFixed(args.decimals)}</td>
        <td> ${(Math.PI * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleCx * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleCy * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleCz * degToRadSwitch).toFixed(args.decimals)}</td>
    <tr>
    <tr>
        <td> c' </td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(RIGHT_ANGLE_CC_RAD * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(Math.PI * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${ZERO.toFixed(args.decimals)}</td>
        <td> ${(angleCCommaX * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleCCommaY * degToRadSwitch).toFixed(args.decimals)}</td>
        <td> ${(angleCCommaZ * degToRadSwitch).toFixed(args.decimals)}</td>
    <tr>       
    `;
}