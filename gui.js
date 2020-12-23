let gui = new dat.GUI({ autoPlace: false });

let vector1Folder = gui.addFolder("v1t")
vector1Folder.add(args, 'v1x', -10, 10).name("X").step(0.01).onChange(draw);
vector1Folder.add(args, 'v1y', -10, 10).name("Y").step(0.01).onChange(draw);
vector1Folder.add(args, 'v1z', -10, 10).name("Z").step(0.01).onChange(draw);
vector1Folder.add(args, 't', -10, 10).name("t").step(0.01).onChange(draw);
vector1Folder.open();

let vector2Folder = gui.addFolder("v2u")
vector2Folder.add(args, 'v2x', -10, 10).name("X").step(0.01).onChange(draw);
vector2Folder.add(args, 'v2y', -10, 10).name("Y").step(0.01).onChange(draw);
vector2Folder.add(args, 'v2z', -10, 10).name("Z").step(0.01).onChange(draw);
vector2Folder.add(args, 'u', -10, 10).name("u").step(0.01).onChange(draw);
vector2Folder.open();

let productsFolder = gui.addFolder("Show products");
productsFolder.add(args, 'showV1plusV2').name("a = v1t + v2u").onChange(draw);
productsFolder.add(args, 'showV1minusV2').name("b = v1t - v2u").onChange(draw);
productsFolder.add(args, 'showV2minusV1').name("b' = v2u - v1t").onChange(draw);
productsFolder.add(args, 'showV1crossV2').name("c = v1t ✕ v2u").onChange(draw);
productsFolder.add(args, 'showV2crossV1').name("c' = v2u ✕ v1t").onChange(draw);

gui.add(args, 'showNormalized').name("Show Normalized").onChange(draw);
gui.add(args, 'showAxis').name("Show Axis").onChange(draw);
gui.add(args, 'showGrid').name("Show Grid").onChange(draw);
gui.add(args, 'showResults').name("Show Results").onChange(draw);
gui.add(args, 'anglesInRad').name("Angles In Rad").onChange(draw);
gui.add(args, 'decimals', 0, 3).name("Decimals").step(1).onChange(draw);

let guiContainerDOM = document.getElementById('dat-gui-container');
guiContainerDOM.appendChild(gui.domElement);