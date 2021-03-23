import * as THREE from 'three';

const threeDView = () => {
  const threeDView = document.getElementById("threed-test");

  if (threeDView) {
    const threedContainer = document.getElementById('threed-container');
    const threedClose = document.getElementById('three-container-close');

    threedClose.addEventListener("click", (event) => {
      threedContainer.classList.toggle("d-none");
      threedClose.classList.toggle("d-none");
    });

    const buttons = document.querySelectorAll(".threed-button");

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        threedContainer.classList.toggle("d-none");
        threedClose.classList.toggle("d-none");

        var packedBins = JSON.parse(threeDView.dataset.json);
        const binIdToRender = event.currentTarget.dataset.boxId;

        // if (!Detector.webgl) Detector.addGetWebGLMessage();

        var container;
        var camera, controls, scene, renderer;
        var cross;
        var randomColorsUsedAlready = new Object();
        var itemColorHash = new Array();
        var itemType = "normal";

        init();
        animate();

        function init() {
          var bin = null;
          
          for (var i = 0; i < packedBins.length; i++) {
            if (packedBins[i].id == binIdToRender) {
              bin = packedBins[i];
            }
          }

          if (bin == null) {
            alert("Error.  Could not find bin");
            return;
          }

          if (bin.size_3 == undefined)
            bin.size_3 = 0.25;

          camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
          camera.position.x = (bin.size_1 + bin.size_2 + bin.size_3) * .7;
          camera.position.y = (bin.size_1 + bin.size_2 + bin.size_3) * .7;
          camera.position.z = (bin.size_1 + bin.size_2 + bin.size_3) * .7;

          //controls = new THREE.TrackballControls(camera);

          // controls.rotateSpeed = 1.0;
          // controls.zoomSpeed = 1.2;
          // controls.panSpeed = 0.8;
          // controls.noZoom = false;
          // controls.noPan = false;
          // controls.staticMoving = true;
          // controls.dynamicDampingFactor = 0.3;
          // controls.keys = [65, 83, 68];

          // controls.addEventListener('change', render);


          // world
          scene = new THREE.Scene();
          scene.fog = new THREE.FogExp2(0xffffff, 0.002);

          var binGeometry = new THREE.BoxGeometry(bin.size_1, bin.size_2, bin.size_3);
          var binMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, wireframe: true });

          var binMesh = new THREE.Mesh(binGeometry, binMaterial);
          binMesh.position.x = 0;
          binMesh.position.y = 0;
          binMesh.position.z = 0;
          binMesh.updateMatrix();
          binMesh.matrixAutoUpdate = false;
          scene.add(binMesh);

          for (var i = 0; i < bin.items.length; ++i) {
            drawItems(scene, bin.items[i]);
          }


          // lights
          var ambientLight = new THREE.AmbientLight(0x444444);
          scene.add(ambientLight);

          var pointLight = new THREE.PointLight(0xffffff, 1.25, 1000);
          pointLight.position.set(0, 0, 600);

          scene.add(pointLight);

          var directionalLight = new THREE.DirectionalLight(0xffffff);
          directionalLight.position.set(1, -0.5, -1);
          scene.add(directionalLight);


          // renderer
          renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setClearColor(scene.fog.color, 1);
          // renderer.setSize(window.innerWidth, window.innerHeight);
          // renderer.setSize(414, 736);
          renderer.setSize(414, 720);

          container = document.getElementById('threed-container');
          container.innerHTML = "";
          container.appendChild(renderer.domElement);
          
          createLegend(bin.name, container);
          
          // window.addEventListener('resize', onWindowResize, false);

          render();
        }

        function drawItems(scene, item) {
          var is3sided = true;

          if (item.sp_size_3 == undefined) {
            item.sp_size_3 = 0.25;
            is3sided = false;
          }

          var itemGeometry = new THREE.BoxGeometry(item.sp_size_1, item.sp_size_2, item.sp_size_3);
          var color = randomColor();

          let itemHash = {
                          title: `${item.name.charAt(0).toUpperCase() + item.name.slice(1)} : ${item.sp_size_1}cm x ${item.sp_size_2}cm x ${item.sp_size_3}cm`,
                          color: color
                          }

          itemColorHash.push(itemHash)

          if (itemType == "normal")
            var itemMaterial = new THREE.MeshPhongMaterial({ color: color });
          else if (itemType == "wireframe")
            var itemMaterial = new THREE.MeshPhongMaterial({ color: color, wireframe: true });
          else if (itemType == "transparent")
            var itemMaterial = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.8 });

            itemMaterial.name = item.id;
            
            var itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
            itemMesh.position.x = item.x_origin_in_bin;
            itemMesh.position.y = item.y_origin_in_bin;

          if (is3sided)
            itemMesh.position.z = item.z_origin_in_bin;
            itemMesh.updateMatrix();
            itemMesh.matrixAutoUpdate = false;
            scene.add(itemMesh);
        }

        function randomColor() {
          var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          
          if ( color.length < 7 || randomColorsUsedAlready[color] == true)
          randomColor();
          else
          randomColorsUsedAlready[color] = true;
          
          return color;
        }

        function createLegend(binName, container) {
          var legend = document.createElement('div');
          var table = document.createElement('table');
          var headerrow = document.createElement('tr');
          var headercell = document.createElement('td');

          headercell.colSpan = 3;
          headercell.innerHTML =`${binName}'s items:`;
          headercell.style.fontWeight = 'bold'
          headercell.style.fontSize = "16px";

          headerrow.appendChild(headercell);
          table.appendChild(headerrow);

          legend.appendChild(table);

          itemColorHash.forEach((itemHash) => {

              var row = document.createElement('tr');
              var key_cell = document.createElement('td');
              var color_cell = document.createElement('td');

              key_cell.innerHTML = itemHash.title;

              var color_div = document.createElement('span');
              color_div.style.height = '10px'
              color_div.style.width = '10px'
              color_div.style.background = itemHash.color;
              color_div.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

              color_cell.appendChild(color_div);

              row.appendChild(color_cell);
              row.appendChild(key_cell);

              table.appendChild(row);
          });

          legend.style.position = 'absolute';
          legend.style.top = '8px';
          legend.style.left = '8px';
          legend.style.color = "#000000";
          legend.style.fontSize = "12px";
          legend.style.zIndex = 100;

          container.appendChild(legend);
        }

        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();

          renderer.setSize(window.innerWidth, window.innerHeight);
          
          controls.handleResize();

          render();

        }

        function animate() {
          requestAnimationFrame(animate);
          //controls.update();
        }

        function render() {
          renderer.render(scene, camera);
        }
      });
    });
  }
}

export default threeDView;
