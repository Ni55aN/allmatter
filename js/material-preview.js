var MaterialPreview = function (el) {

	function takeControl(e) {
		e.stopPropagation();
		controls.update();
	}

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.0001, 10);
	camera.position.set(1.2, 1.8, 3.2)

	var renderer = new THREE.WebGLRenderer({
		antialiasing: true,
		alpha: true
	});
	window.renderer = renderer;
	el.appendChild(renderer.domElement);
	renderer.setClearColor(0x000000, 0);

	renderer.context.canvas.addEventListener("webglcontextrestored", function (event) {
		render();
	}, false);


	var render = this.render = function () {
		renderer.render(scene, camera);
	}


	this.resize = function () {
		camera.aspect = el.clientWidth / el.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(el.clientWidth, el.clientHeight);
		render();
	}

	window.addEventListener('resize', this.resize);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', function () {
		render();
	});
	controls.target = new THREE.Vector3(0, 0, 0);
	controls.update();

	el.addEventListener("wheel", takeControl);
	el.addEventListener("mousedown", takeControl);


	var alight = new THREE.AmbientLight(0x777777);
	scene.add(alight);

	var light = new THREE.PointLight(0xffffff, 0.8);
	light.position.set(2, 1, 2);
	scene.add(light);

	var light2 = new THREE.PointLight(0xffffff, 0.7);
	light2.position.set(-2, 2, -2.5);
	scene.add(light2);

	var size = 1;
	var segments = 100;
	var geom = new THREE.BoxGeometry(size, size, size, segments, segments, segments);
	var mat = new THREE.MeshPhysicalMaterial();

	var path = "envMap/";
	var format = '.jpg';
	var urls = [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
	];

	var reflectionCube = new THREE.CubeTextureLoader().load(urls);
	mat.envMap = reflectionCube;

	var tessellateModifier = new THREE.TessellateModifier(0.04);

	var cube = null;
	new THREE.OBJLoader().load(
		'models/cube.obj',
		function (object) {
			cube = object.children[0];
			cube.rotation.x = Math.PI / 2;
			var geometry = new THREE.Geometry().fromBufferGeometry(cube.geometry);
			for (var i = 0; i < 15; i++) {
				tessellateModifier.modify(geometry);
			}

			cube.geometry = new THREE.BufferGeometry().fromGeometry(geometry);
			cube.material = mat;
			cube.material.roughness = 1.0;
			cube.material.metalness = 1.0;
			cube.material.emissive.setRGB(1, 1, 1);
			scene.add(cube);
		}
	);

	var textureLoader = new THREE.TextureLoader();
	var updateMap = function (src, mapName) {
		return new Promise((res, rej) => {
			var texture = textureLoader.load(src, function (texture) {

				if (cube.material[mapName] instanceof THREE.Texture) {
					cube.material[mapName].dispose();
					cube.material[mapName] = null;
				}
				texture.anisotropy = 8;
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				cube.material[mapName] = texture;
				cube.material.needsUpdate = true;
				res();
			});
		})
	}

	this.update = async function (maps) {
		await updateMap(maps.diffuse, 'map');
		await updateMap(maps.normal, 'normalMap');
		await updateMap(maps.roughness, 'roughnessMap');
		await updateMap(maps.metalness, 'metalnessMap');
		await updateMap(maps.emissive, 'emissiveMap');
		await updateMap(maps.displacement, 'displacementMap');
		render();
	}

	this.resize();
	this.render();
}