<template lang="pug">
.preview
</template>

<script>
var THREE = require("three");
var OrbitControls = require("three-orbit-controls")(THREE);
var OBJLoader = require("three-obj-loader");

OBJLoader(THREE);

export class MaterialPreview {
  constructor(el) {
    this.el = el;
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      50,
      el.clientWidth / el.clientHeight,
      0.0001,
      10
    );
    this.camera.position.set(1.2, 1.8, 3.2);

    this.renderer = this.createRenderer();

    this.el.parentElement.addEventListener("resize", this.resize.bind(this));

    this.controls = this.createControls();

    var alight = new THREE.AmbientLight(0x777777);

    this.scene.add(alight);

    var light = new THREE.PointLight(0xffffff, 0.8);

    light.position.set(2, 1, 2);
    this.scene.add(light);

    var light2 = new THREE.PointLight(0xffffff, 0.7);

    light2.position.set(-2, 2, -2.5);
    this.scene.add(light2);

    this.mesh = this.createMesh();

    this.loadEnvMap("envMap/", ".jpg");
    this.loadGeometry("cube");

    this.resize();
    this.render();
  }

  createRenderer() {
    var r = new THREE.WebGLRenderer({ antialiasing: true, alpha: true });

    this.el.appendChild(r.domElement);
    r.setClearColor(0x000000, 0);

    r.context.canvas.addEventListener(
      "webglcontextrestored",
      this.render.bind(this)
    );
    return r;
  }

  loadGeometry(name) {
    // var tessellateModifier = new THREE.TessellateModifier(0.04);

    new THREE.OBJLoader().load(`/models/${name.toLowerCase()}.obj`, object => {
      var geom = object.children[0].geometry;
      var geometry = new THREE.Geometry().fromBufferGeometry(geom);

      for (var i = 0; i < 15; i++) {
        //     tessellateModifier.modify(geometry);
      }

      this.mesh.geometry = new THREE.BufferGeometry().fromGeometry(geometry);
      this.render();
    });
  }

  createControls() {
    var takeControl = e => {
      e.stopPropagation();
      this.controls.update();
    };

    var controls = new OrbitControls(this.camera, this.renderer.domElement);

    controls.addEventListener("change", this.render.bind(this));

    controls.target = new THREE.Vector3(0, 0, 0);
    controls.update();

    this.el.addEventListener("wheel", takeControl.bind(this));
    this.el.addEventListener("mousedown", takeControl.bind(this));

    return controls;
  }

  createMesh() {
    var mesh = new THREE.Mesh();

    this.scene.add(mesh);
    mesh.material = new THREE.MeshPhysicalMaterial();
    mesh.material.roughness = 1.0;
    mesh.material.metalness = 1.0;
    mesh.material.emissive.setRGB(1, 1, 1);
    return mesh;
  }

  loadEnvMap(path, format) {
    var urls = [
      path + "px" + format,
      path + "nx" + format,
      path + "py" + format,
      path + "ny" + format,
      path + "pz" + format,
      path + "nz" + format
    ];

    var reflectionmesh = new THREE.CubeTextureLoader().load(urls);

    this.mesh.material.envMap = reflectionmesh;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = this.el.clientWidth / this.el.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
    this.render();
  }

  updateMap(src, mapName) {
    return new Promise((res, rej) => {
      var texture = new THREE.TextureLoader().load(src, texture => {
        if (this.mesh.material[mapName] instanceof THREE.Texture) {
          this.mesh.material[mapName].dispose();
          this.mesh.material[mapName] = null;
        }
        texture.anisotropy = 8;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.mesh.material[mapName] = texture;
        this.mesh.material.needsUpdate = true;
        res();
      });
    });
  }

  async update(maps) {
    await this.updateMap(maps.diffuse, "map");
    await this.updateMap(maps.normal, "normalMap");
    await this.updateMap(maps.roughness, "roughnessMap");
    await this.updateMap(maps.metalness, "metalnessMap");
    await this.updateMap(maps.emissive, "emissiveMap");
    await this.updateMap(maps.displacement, "displacementMap");
    this.render();
  }
}

export default {
  data() {
    return { preview: null };
  },
  mounted() {
    var store = this.$store;
    this.preview = new MaterialPreview(this.$el);
    this.preview.render();

    store.watch(
      () => store.getters.maps,
      () => {
        this.preview.update(store.state.maps);
      }
    );

    store.watch(
      () => store.getters.geometry,
      () => {
        this.preview.loadGeometry(store.state.geometry);
      }
    );

    window.addEventListener("resize", this.preview.resize.bind(this.preview));
  },
  beforeDestroy() {
    window.removeEventListener(
      "resize",
      this.preview.resize.bind(this.preview)
    );
  }
};
</script>

<style lang="sass">
.preview
</style>

