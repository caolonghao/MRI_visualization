import {colors, files} from './utils.js';

// Classic ThreeJS setup
const container = document.getElementById('container');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor(colors.darkGrey, 1);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  container.offsetWidth / container.offsetHeight,
  0.1,
  1000
);
camera.position.x = 150;
camera.position.y = 150;
camera.position.z = 100;

const controls = new AMI.TrackballControl(camera, container);

const onWindowResize = () => {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.offsetWidth, container.offsetHeight);
};

window.addEventListener('resize', onWindowResize, false);

// Load DICOM images and create AMI Helpers
const loadDicomFiles = (fileUrls) => {
  const loader = new AMI.VolumeLoader(container);
  console.log('Loading files:', fileUrls); // 调试输出
  loader
    .load(fileUrls)
    .then(() => {
      console.log('Files loaded successfully'); // 调试输出
      const series = loader.data[0].mergeSeries(loader.data);
      const stack = series[0].stack[0];
      loader.free();

      const stackHelper = new AMI.StackHelper(stack);
      stackHelper.bbox.color = colors.red;
      stackHelper.border.color = colors.blue;

      scene.add(stackHelper);

      // Build the GUI
      buildGui(stackHelper);

      // Center camera and interactor to center of bounding box
      const centerLPS = stackHelper.stack.worldCenter();
      camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
      camera.updateProjectionMatrix();
      controls.target.set(centerLPS.x, centerLPS.y, centerLPS.z);
    })
    .catch((error) => {
      console.log('oops... something went wrong...');
      console.log(error);
    });
};

loadDicomFiles(files);

const animate = () => {
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(() => {
    animate();
  });
};
animate();

// setup gui
const buildGui = stackHelper => {
  const stack = stackHelper.stack;
    const customContainer = document.getElementById('my-gui-container');

    // Remove previous GUI
    while (customContainer.firstChild) {
        customContainer.removeChild(customContainer.firstChild);
    }

    const gui = new dat.GUI({
        autoPlace: false,
    });
    customContainer.appendChild(gui.domElement);

  // Add file input to GUI
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'dicom-file-input';
  fileInput.multiple = true;
  fileInput.style.display = 'block';
  fileInput.style.marginBottom = '10px';
  customContainer.insertBefore(fileInput, gui.domElement);

  fileInput.addEventListener('change', (event) => {
    const inputFiles = event.target.files;
    if (inputFiles.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < inputFiles.length; i++) {
            formData.append('files', inputFiles[i]);
        }

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(fileUrls => {
            console.log('fileUrls:', fileUrls); // 调试输出
            // Clear previous scene
            scene.clear();
            // Load new files
            loadDicomFiles(fileUrls);
        })
        .catch(error => {
            console.log('oops... something went wrong...');
            console.log(error);
        });
    }
  });


  // stack
  const stackFolder = gui.addFolder('Stack');
  // index range depends on stackHelper orientation.
  const index = stackFolder
    .add(stackHelper, 'index', 0, stack.dimensionsIJK.z - 1)
    .step(1)
    .listen();
  const orientation = stackFolder
    .add(stackHelper, 'orientation', 0, 2)
    .step(1)
    .listen();
  orientation.onChange(value => {
    index.__max = stackHelper.orientationMaxIndex;
    stackHelper.index = Math.floor(index.__max / 2);
  });
  stackFolder.open();

  // slice
  const sliceFolder = gui.addFolder('Slice');
  sliceFolder
    .add(stackHelper.slice, 'windowWidth', 1, stack.minMax[1] - stack.minMax[0])
    .step(1)
    .listen();
  sliceFolder
    .add(stackHelper.slice, 'windowCenter', stack.minMax[0], stack.minMax[1])
    .step(1)
    .listen();
  sliceFolder.add(stackHelper.slice, 'intensityAuto').listen();
  sliceFolder.add(stackHelper.slice, 'invert');
  sliceFolder.open();

  // bbox
  const bboxFolder = gui.addFolder('Bounding Box');
  bboxFolder.add(stackHelper.bbox, 'visible');
  bboxFolder.addColor(stackHelper.bbox, 'color');
  bboxFolder.open();

  // border
  const borderFolder = gui.addFolder('Border');
  borderFolder.add(stackHelper.border, 'visible');
  borderFolder.addColor(stackHelper.border, 'color');
  borderFolder.open();
};
