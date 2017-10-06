var editor, engine, materialPreview, texturePreview;

function controller($scope, $el, a, env) {

	$scope.textureSize = 4096;
	$scope.textureSizeStep = 10;
	env.watch('textureSizeStep', (textureSizeStep) => {
		$scope.textureSize = Math.pow(2, textureSizeStep);
		editor.eventListener.trigger('change');
	});

	$scope.models = ['Cube', 'Sphere'];
	$scope.selected = $scope.models[0];
	$scope.changeModel = () => {
		materialPreview.loadGeometry($scope.selected.toLowerCase());
	}

	$scope.target = null;
	alight.directives.al.region = (scope, el, name, env) => {

		env.changeDetector.watch('target', () => {
			if (scope.target == name || scope.target == null)
				el.style.display = 'block';
			else
				el.style.display = 'none';
		});

		el.addEventListener('dblclick', (e) => {
			if ($scope.target != name)
				$scope.target = name;
			else
				$scope.target = null;
			env.changeDetector.scan();
			resize();
		});
	};

	alight.directives.al.newProject = function (scope, el, expression, env) {
		el.onclick = () => {
			console.log(455);
			editor.fromJSON({
				id: 'proc-material@0.1.0',
				nodes: {},
				groups: {}
			});
		}
	}

	alight.directives.al.openFileDialog = function (scope, el, expression, env) {
		var input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', '.mtr');
		input.setAttribute('style', 'display: none');

		input.addEventListener('change', () => {
			if (input.files.length === 0) return;

			var file = input.files[0];
			var reader = new FileReader();

			reader.onload = (e) => {
				input.value = ''; //clear files
				var data = JSON.parse(e.target.result);
				processReady = false;
				editor.fromJSON(data);
				processReady = true;
				editor.eventListener.trigger('change');
				editor.view.zoomAt(editor.nodes);
			};
			reader.onabort = (e) => {
				alert(e.message);
			}
			reader.readAsText(file);
		});

		el.parentElement.appendChild(input);
		el.addEventListener('click', () => input.click());
	}

	alight.directives.al.saveProject = function (scope, el, expression, env) {
		el.onclick = () => {
			var data = JSON.stringify(editor.toJSON());
			var blob = new Blob([data], {
				type: "application/json;charset=utf-8"
			});
			saveAs(blob, "project.mtr");
		};
	}

	var processReady = false;

	var elm = document.querySelector('#material-preview');
	materialPreview = new MaterialPreview(elm, );

	var elt = document.querySelector('#texture-preview');
	texturePreview = new TexturePreview(elt);

	Texturity.initGL('webgl2');

	function resize() {
		materialPreview.resize();
		texturePreview.resize();
		editor.view.resize();
	}

	function writeStorage() {
		localStorage.allmatter = JSON.stringify(editor.toJSON())
	}

	function readStorage() {
		if (localStorage.allmatter) {
			try {
				editor.fromJSON(JSON.parse(localStorage.allmatter));
			} catch (e) {
				console.error(e);
				alert(e.message);
			}
		}
	}

	var menu = new D3NE.ContextMenu('https://d3-node-editor.surge.sh/menu.html', {
		"Input": {
			"Texture": builder["input texture"],
			"Number": builder["input number"],
			"Curve": builder["input curve"],
			"Color": builder["input color"]
		},
		"Generator": {
			"White": builder["white"],
			"Noise": builder["noise texture"],
			"Brick": builder["brick texture"],
			"Circle": builder["circle texture"]
		},
		"Texture": {
			"Transform": builder["texture transform"],
			"Lightness": builder["lightness"],
			"Normal": builder["normal map"],
			"Blur": builder["blur"],
			"Gradient": builder["texture gradient"],
			"Invert": builder["invert"],
			"Blend": builder["blend"]
		},
		"Math": {
			"Add": builder["add"],
			"Subtract": builder["subtract"],
			"Distance": builder["distance"],
			"Multiply": builder["multiply"],
			"Divide": builder["divide"],
			"Pow": builder["pow"]
		},
		"Output": {
			"Material": builder["output material"]
		}
	});

	editor = new D3NE.NodeEditor('proc-material@0.1.0', $el.querySelector('#nodeEditor'),
		'https://d3-node-editor.surge.sh/view.html', builder,
		menu);
	editor.view.zoom.translateExtent([
		[-3000, -3000],
		[6000, 6000]
	]);
	editor.eventListener.on('nodecreate', function (node) {
		if (editor.nodes.filter(n => n.title == "Output material").length > 1) {
			editor.removeNode(node);
			alert("Output material already exist");
		}
	});

	editor.eventListener.on('change', async function (i) {
		if (!processReady) return;

		writeStorage();
		console.time('process');
		var data = editor.toJSON();
		var startId = Object.keys(data.nodes).filter(key => data.nodes[key].title == "Output material")[0];

		await engine.process(data, data.nodes[startId]);
		console.timeEnd('process');

		Texturity.disposeTextures();
		texturePreview.update();
	});


	engine = new D3NE.Engine('proc-material@0.1.0', workers($scope, editor));

	readStorage();

	editor.eventListener.on('load', function () {
		processReady = true;
		editor.view.zoomAt(editor.nodes);
		editor.eventListener.trigger('change');
	});


	$scope.changeModel();
	resize();
}