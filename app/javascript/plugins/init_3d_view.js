import * as THREE from 'three';
import Detector from './Detector.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

const threeDView = () => {
  // this container is on the 3d view partial. It is what the 3d view will be rendered in. It also contains the json data
  const threeDContainer = document.getElementById('threed-container');

  if (threeDContainer) {
    const threeDCloseButton = document.getElementById('three-container-close');

    // hide 3d view and button when close button is clicked
    threeDCloseButton.addEventListener("click", (event) => {
      threeDContainer.classList.toggle("d-none");
      threeDCloseButton.classList.toggle("d-none");
    });

    const buttons = document.querySelectorAll(".threed-button");

    // for each of the "3D VIEW" buttons, we we want to run this code
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        // show container and button
        threeDContainer.classList.toggle("d-none");
        threeDCloseButton.classList.toggle("d-none");

        // get json data from container and what bin to render from the button we clicked
        const packedBins = JSON.parse(threeDContainer.dataset.json);
        const binIdToRender = event.currentTarget.dataset.boxId;

        // if browser does not support WebGL throw a error message
        if (!Detector.webgl) {
          Detector.addGetWebGLMessage();
        }

        // pre-initialise
        let camera, controls, scene, renderer;
        let randomColorsUsedAlready = new Object();
        let itemColorHash = new Array();
        let itemType = "normal";

        init();
        animate();

        function init() {
          let bin = null;
          
          // get the bin data from the json
          for (let i = 0; i < packedBins.length; i++) {
            if (packedBins[i].id == binIdToRender) {
              bin = packedBins[i];
            }
          }

          if (bin == null) {
            alert("Error.  Could not find bin");
            return;
          }

          if (bin.size_3 == undefined) {
            bin.size_3 = 0.25;
          }

          // create camera and 3d view controls (mouse interaction)
          camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
          camera.position.x = (bin.size_1 + bin.size_2 + bin.size_3) * .7;
          camera.position.y = (bin.size_1 + bin.size_2 + bin.size_3) * .7;
          camera.position.z = (bin.size_1 + bin.size_2 + bin.size_3) * .7;

          controls = new TrackballControls(camera, threeDContainer);

          controls.rotateSpeed = 1.0;
          controls.zoomSpeed = 1.2;
          controls.panSpeed = 0.8;
          controls.noZoom = false;
          controls.noPan = false;
          controls.staticMoving = true;
          controls.dynamicDampingFactor = 0.3;
          controls.keys = [65, 83, 68];

          controls.addEventListener('change', render);


          // world
          scene = new THREE.Scene();
          scene.fog = new THREE.FogExp2(0xffffff, 0.002);

          // this is the wireframe box which represents the packing container
          let binGeometry = new THREE.BoxGeometry(bin.size_1, bin.size_2, bin.size_3);
          let binMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, wireframe: true });
          let binMesh = new THREE.Mesh(binGeometry, binMaterial);

          binMesh.position.x = 0;
          binMesh.position.y = 0;
          binMesh.position.z = 0;
          binMesh.updateMatrix();
          binMesh.matrixAutoUpdate = false;

          scene.add(binMesh);

          // iterate over each of the items and draw them to the scene
          for (let i = 0; i < bin.items.length; ++i) {
            drawItems(scene, bin.items[i]);
          }


          // lights
          // this is the general scene ambience (no light source)
          let ambientLight = new THREE.AmbientLight(0x999999);
          scene.add(ambientLight);

          // add two point lights, opposite sides to each other and slightly elevated
          let pointLight = new THREE.PointLight(0xffffff, 1.5, 1000);
          pointLight.position.set(0, 100, 600);

          let secondPointLight = new THREE.PointLight(0xffffff, 1.5, 1000);
          secondPointLight.position.set(0, 100, -600);

          scene.add(pointLight);
          scene.add(secondPointLight);
          
          // renderer
          renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setClearColor(scene.fog.color, 1);
          renderer.setSize(window.innerWidth, window.innerHeight);

          // empty contents of the container and add the renderer to it
          threeDContainer.innerHTML = "";
          threeDContainer.appendChild(renderer.domElement);
          
          createLegend(bin.name, threeDContainer);
          
          window.addEventListener('resize', onWindowResize, false);

          render();
        }

        function drawItems(scene, item) {
          let is3sided = true;

          if (item.sp_size_3 == undefined) {
            item.sp_size_3 = 0.25;
            is3sided = false;
          }

          var itemGeometry = new THREE.BoxGeometry(item.sp_size_1, item.sp_size_2, item.sp_size_3);
          const color = randomColor();

          // make a hash based on the item's name and the colour we generated, and push it to the array
          // we made at the start. The createLegend function will use this data
          const itemHash = {
                            title: `${item.name.charAt(0).toUpperCase() + item.name.slice(1)} : ${item.sp_size_1}cm x ${item.sp_size_2}cm x ${item.sp_size_3}cm`,
                            color: color
                           }
          itemColorHash.push(itemHash)

          // define item material
          // right now the item material is always normal and we have no functionality for the 
          // user to change between the modes, however, it is here for future use if want it
          if (itemType == "normal") {
            var itemMaterial = new THREE.MeshPhongMaterial({ color: color });
          } else if (itemType == "wireframe") {
            var itemMaterial = new THREE.MeshPhongMaterial({ color: color, wireframe: true });
          } else if (itemType == "transparent") {
            var itemMaterial = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.8 });
          }

          itemMaterial.name = item.id;
            
          var itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
          itemMesh.position.x = item.x_origin_in_bin;
          itemMesh.position.y = item.y_origin_in_bin;

          if (is3sided) {
            itemMesh.position.z = item.z_origin_in_bin;
          }

          itemMesh.updateMatrix();
          itemMesh.matrixAutoUpdate = false;
          scene.add(itemMesh);
        }

        function randomColor() {
          // create a random number (256^3) and convert to hex
          let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          
          // if the hex number is invalid or the colour has already been used, recreate the colour
          if (color.length < 7 || randomColorsUsedAlready[color] == true) {
            randomColor();
          }
          
          // add the colour to the hash and return
          randomColorsUsedAlready[color] = true;
          return color;
        }

        function createLegend(binName, container) {
          // create legend, table and header
          let legend = document.createElement('div');
          let table = document.createElement('table');
          let headerrow = document.createElement('tr');
          let headercell = document.createElement('td');

          // create header cell
          headercell.colSpan = 3;
          headercell.innerHTML =`${binName}'s items:`;
          headercell.style.fontWeight = 'bold'
          headercell.style.fontSize = "16px";

          // append header to legend
          headerrow.appendChild(headercell);
          table.appendChild(headerrow);
          legend.appendChild(table);

          // for each item essentially, create a table row consisting of two cells (color cell and then title)
          itemColorHash.forEach((itemHash) => {

              let row = document.createElement('tr');
              let color_cell = document.createElement('td');
              let color_div = document.createElement('span');
              let title_cell = document.createElement('td');

              // color cell
              color_div.style.height = '10px'
              color_div.style.width = '10px'
              color_div.style.background = itemHash.color;
              color_div.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

              // title cell
              title_cell.innerHTML = itemHash.title;

              color_cell.appendChild(color_div);
              row.appendChild(color_cell);
              row.appendChild(title_cell);

              table.appendChild(row);
          });

          // add the legend to the container and give it an id (it has styling in components)
          legend.id = "threed-legend"
          container.appendChild(legend);
        }

        function onWindowResize() {
          // update the camera, controls and renderer size when the window's size changes
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();

          renderer.setSize(window.innerWidth, window.innerHeight);
          
          controls.handleResize();

          render();
        }

        function animate() {
          requestAnimationFrame(animate);
          controls.update();
        }

        function render() {
          renderer.render(scene, camera);
        }
      });
    });
  }
}

export default threeDView;
