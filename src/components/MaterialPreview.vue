<template lang="pug">
.preview-material
</template>

<script>
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const OBJLoader = require('three-obj-loader');

OBJLoader.call(null, THREE);

export class MaterialPreview {
    constructor(el) {
        this.el = el;
        
        this.scene = new THREE.Scene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer();

        this.controls = this.createControls();

        this.mesh = this.createMesh();

        this.createLights();
        this.loadEnvMap('envMap/', '.jpg');
        this.loadGeometry('cube');

        this.resize();
    }

    createCamera() {
        const camera = new THREE.PerspectiveCamera(
            50,
            this.el.clientWidth / this.el.clientHeight,
            0.0001,
            10
        );

        camera.position.set(1.2, 1.8, 3.2);

        return camera;
    }

    createRenderer() {
        const r = new THREE.WebGLRenderer({
            antialiasing: true,
            alpha: true,
            preserveDrawingBuffer: true
        });

        this.el.appendChild(r.domElement);
        r.setClearColor(0x000000, 0);

        r.context.canvas.addEventListener(
            'webglcontextrestored',
            this.render.bind(this)
        );

        this.el.parentElement.addEventListener('resize', this.resize.bind(this));
        
        return r;
    }

    createLights() {
        const alight = new THREE.AmbientLight(0x777777);

        this.scene.add(alight);

        const light = new THREE.PointLight(0xffffff, 0.8);

        light.position.set(2, 1, 2);
        this.scene.add(light);

        const light2 = new THREE.PointLight(0xffffff, 0.7);

        light2.position.set(-2, 2, -2.5);
        this.scene.add(light2);
    }

    loadGeometry(name) {
    // var tessellateModifier = new THREE.TessellateModifier(0.04);

        new THREE.OBJLoader().load(`models/${name.toLowerCase()}.obj`, object => {
            const geom = object.children[0].geometry;
            const geometry = new THREE.Geometry().fromBufferGeometry(geom);

            for (let i = 0; i < 15; i++) {
                //     tessellateModifier.modify(geometry);
            }

            this.mesh.geometry = new THREE.BufferGeometry().fromGeometry(geometry);
            this.render();
        });
    }

    createControls() {
        const takeControl = e => {
            e.stopPropagation();
            this.controls.update();
        };

        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        controls.addEventListener('change', this.render.bind(this));

        controls.target = new THREE.Vector3(0, 0, 0);
        controls.update();

        this.el.addEventListener('wheel', takeControl.bind(this));
        this.el.addEventListener('mousedown', takeControl.bind(this));

        return controls;
    }

    createMesh() {
        const mesh = new THREE.Mesh();

        this.scene.add(mesh);
        mesh.material = new THREE.MeshPhysicalMaterial();
        mesh.material.roughness = 1.0;
        mesh.material.metalness = 1.0;
        mesh.material.emissive.setRGB(1, 1, 1);
        mesh.material.transparent = true;
        mesh.material.side = THREE.DoubleSide;
        mesh.material.alphaTest = 0.1;
        return mesh;
    }

    loadEnvMap(path, format) {
        const urls = [
            path + 'px' + format,
            path + 'nx' + format,
            path + 'py' + format,
            path + 'ny' + format,
            path + 'pz' + format,
            path + 'nz' + format
        ];

        const reflectionmesh = new THREE.CubeTextureLoader().load(urls);

        this.mesh.material.envMap = reflectionmesh;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resize(w, h) {
        w = typeof w === 'number' ? w : this.el.clientWidth;
        h = typeof h === 'number' ? h : this.el.clientHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.render();
    }

    getPreview() {
        this.resize(256, 256);

        const src = this.renderer.domElement.toDataURL();

        this.resize();
        return src;
    }

    updateMap(src, mapName) {
        return new Promise((res) => {
            new THREE.TextureLoader().load(src, texture => {
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
        await this.updateMap(maps.diffuse, 'map');
        await this.updateMap(maps.normal, 'normalMap');
        await this.updateMap(maps.roughness, 'roughnessMap');
        await this.updateMap(maps.metalness, 'metalnessMap');
        await this.updateMap(maps.emissive, 'emissiveMap');
        await this.updateMap(maps.displacement, 'displacementMap');
        await this.updateMap(maps.alpha, 'alphaMap');
        this.render();
    }
}

export default {
    data() {
        return { preview: null };
    },
    mounted() {
        const store = this.$store;

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

        window.addEventListener('resize', this.preview.resize.bind(this.preview));
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.preview.resize.bind(this.preview));
    }
};
</script>

<style lang="sass">
</style>

