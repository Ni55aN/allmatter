import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

const Styles = styled.div`
  width: 100%;
  height: 100%;
`

class MaterialPreviewFacade {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer

  controls: OrbitControls

  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>

  constructor(private el: HTMLElement) {
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
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });

    this.el.appendChild(r.domElement);
    r.setClearColor(0x000000, 0);

    // (r as any).context.canvas.addEventListener(
    //   'webglcontextrestored',
    //   this.render.bind(this)
    // );

    r.outputColorSpace = THREE.LinearSRGBColorSpace

    return r;
  }

  createLights() {
    const alight = new THREE.AmbientLight(0xffffff, 0.2);

    this.scene.add(alight);

    const light = new THREE.PointLight(0xffffff, 0.4);

    light.position.set(2, 1, 2);
    this.scene.add(light);

    const light2 = new THREE.PointLight(0xffffff, 0.4);

    light2.position.set(-2, 2, -2.5);
    this.scene.add(light2);
  }

  loadGeometry(name: string) {
    new OBJLoader().load(`models/${name.toLowerCase()}.obj`, object => {
      const child = object.children[0]
      if (child instanceof THREE.Mesh) {
        this.mesh.geometry = child.geometry
        this.render();
      }
    });
  }

  createControls() {
    const takeControl = (e: Event) => {
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
    const mesh = new THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>();

    this.scene.add(mesh);
    mesh.material = new THREE.MeshPhysicalMaterial();
    mesh.material.roughness = 1.0;
    mesh.material.metalness = 1.0;
    mesh.material.emissive.setRGB(255, 255, 255);
    mesh.material.transparent = true;
    mesh.material.side = THREE.DoubleSide;
    mesh.material.alphaTest = 0.1;
    return mesh;
  }

  loadEnvMap(path: string, format: string) {
    const urls = [
      path + 'px' + format,
      path + 'nx' + format,
      path + 'py' + format,
      path + 'ny' + format,
      path + 'pz' + format,
      path + 'nz' + format
    ];

    const reflectionmesh = new THREE.CubeTextureLoader().load(urls);
    // reflectionmesh.
    this.scene.environment = reflectionmesh
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize(w?: number, h?: number) {
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

  updateMap(src: any, mapName: any) {
    return new Promise<void>((res) => {
      new THREE.TextureLoader().load(src, texture => {
        const m = this.mesh.material as any

        if (m[mapName] instanceof THREE.Texture) {
          m[mapName].dispose();
          m[mapName] = null;
        }
        texture.colorSpace = THREE.LinearSRGBColorSpace
        texture.anisotropy = 8;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        m[mapName] = texture;
        this.mesh.material.needsUpdate = true;
        res();
      });
    });
  }

  async update(maps: Record<string, THREE.Texture>) {
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

export function MaterialPreview({ geometry, maps }: { geometry: string, maps: Record<string, THREE.Texture> }) {
  const ref = useRef<HTMLDivElement>(null)
  const preview = useRef<MaterialPreviewFacade>()

  useEffect(() => {
    if (!ref.current) return

    preview.current = new MaterialPreviewFacade(ref.current);
    const resize = () => preview.current?.resize()

    preview.current.render()

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    if (preview.current) {
      preview.current.loadGeometry(geometry)
    }
  }, [geometry])

  useEffect(() => {
    if (preview.current) {
      preview.current.update(maps)
    }
  }, [maps])

  return (
    <Styles ref={ref}></Styles>
  )
}
