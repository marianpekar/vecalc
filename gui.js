let gui = new dat.GUI({ autoPlace: false });

let vector1Folder = gui.addFolder("v1")
vector1Folder.add(args, 'v1x', -10, 10).name("X").step(0.1).onChange(draw);
vector1Folder.add(args, 'v1y', -10, 10).name("Y").step(0.1).onChange(draw);
vector1Folder.add(args, 'v1z', -10, 10).name("Z").step(0.1).onChange(draw);
vector1Folder.open();

let vector2Folder = gui.addFolder("v2")
vector2Folder.add(args, 'v2x', -10, 10).name("X").step(0.1).onChange(draw);
vector2Folder.add(args, 'v2y', -10, 10).name("Y").step(0.1).onChange(draw);
vector2Folder.add(args, 'v2z', -10, 10).name("Z").step(0.1).onChange(draw);
vector2Folder.open();

gui.add(args, 'showAxis').name("Show Axis").onChange(draw);
gui.add(args, 'showGrid').name("Show Grid").onChange(draw);
gui.add(args, 'showNormalized').name("Show Normalized").onChange(draw);
gui.add(args, 'anglesInRad').name("Angles In Rad").onChange(draw);
gui.add(args, 'decimals', 1, 5).name("Decimals").step(1).onChange(draw);

let guiContainerDOM = document.getElementById('dat-gui-container');
guiContainerDOM.appendChild(gui.domElement);