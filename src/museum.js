import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { exhibits as azExhibits, environments as azEnvironments } from './data/exhibits.js';
import { englishExhibits, englishEnvironments } from './data/english.js';
const english = localStorage.getItem('tarix-language') !== 'az';
const exhibits = english ? azExhibits.map((item,i)=>({...item,...englishExhibits[i]})) : azExhibits;
const environments = english ? azEnvironments.map((item,i)=>({...item,...englishEnvironments[i]})) : azEnvironments;
const modelUrl = file => `${import.meta.env.BASE_URL}models/${file}`;

const clay = new THREE.MeshStandardMaterial({ color: '#ad6947', roughness: .83 });
const vec = (x, y, z) => new THREE.Vector3(x, y, z);
const bound = (n, min, max) => Math.max(min, Math.min(max, n));

export class Museum {
  constructor(container, callbacks, settings) {
    this.container = container;
    this.callbacks = callbacks;
    this.settings = settings;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#d4d4c4');
    this.scene.fog = new THREE.Fog('#e4e1d4', 35, 100);
    this.camera = new THREE.PerspectiveCamera(58, 1, .08, 180);
    this.camera.rotation.order = 'YXZ';
    this.camera.position.set(1.7, 3.2, 15);
    this.camera.lookAt(-2, 1.5, -7);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, settings.quality === 'low' ? 1 : 1.6));
    this.renderer.shadowMap.enabled = settings.quality !== 'low';
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = .92;
    this.renderer.domElement.setAttribute('aria-label', english ? 'Walkable 3D museum. You can also use the Collection menu.' : 'Gəzilə bilən 3D muzey. Alternativ olaraq Kolleksiya menyusundan istifadə edin.');
    this.renderer.domElement.tabIndex = 0;
    container.append(this.renderer.domElement);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.environmentMap = pmrem.fromScene(room, .04);
    this.scene.environment = this.environmentMap.texture;
    this.scene.environmentIntensity = .55;
    room.dispose(); pmrem.dispose();
    this.scene.add(new THREE.HemisphereLight('#fff6e5', '#817b63', .85));
    const sun = new THREE.DirectionalLight('#fff0cc', 2.6);
    sun.position.set(-12, 24, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 40, bottom: -40, near: 1, far: 85 });
    sun.shadow.bias = -.0003;
    sun.shadow.normalBias = .035;
    this.scene.add(sun);
    this.gallery = new THREE.Group();
    this.outdoor = new THREE.Group();
    this.outdoor.visible = false;
    this.scene.add(this.gallery, this.outdoor);
    this.keys = new Set(); this.cache = new Map(); this.colliders = [];
    this.targets = []; this.stations = []; this.exploring = false; this.blocked = false;
    this.currentEnvironment = 'gallery'; this.sceneToken = 0; this.motion = null; this.selected = null;
    this.raycaster = new THREE.Raycaster(); this.pointer = new THREE.Vector2(4, 4);
    this.joystick = { x: 0, y: 0 }; this.hovered = -1; this.lastTick = 0; this.elapsed = 0;
    this.buildGallery(); this.bindInput(); this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(container);
    this.renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); this.callbacks.error(english ? 'The 3D view stopped. You can read the collection or reload the page.' : '3D görüntü dayandı. Kolleksiyanı oxuya və ya səhifəni yeniləyə bilərsiniz.'); });
    this.renderer.setAnimationLoop(time => this.frame(time));
    // Deliberately load three at a time, keeping the first frame independent of assets.
    this.ready = this.loadExhibits();
  }

  material(color, roughness = .85, metalness = 0) { return new THREE.MeshStandardMaterial({ color, roughness, metalness }); }
  box(w, h, d, x, y, z, mat, parent = this.gallery) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z); mesh.receiveShadow = true; mesh.castShadow = true; parent.add(mesh); return mesh;
  }
  label(text, width, height, color = '#314a3c', bg = null, font = '500 80px "Cormorant Garamond"') {
    const c = document.createElement('canvas'); c.width = 1024; c.height = Math.max(128, Math.round(1024 * height / width));
    const ctx = c.getContext('2d');
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = font;
    ctx.fillText(text, 512, c.height / 2, 960);
    const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, transparent: !bg, side: THREE.DoubleSide }));
    return mesh;
  }
  buildGallery() {
    const stone = this.material('#ddd5c1');
    const plaster = this.material('#eee8d9');
    const floor = this.material('#bbb5a3', .46);
    const dark = this.material('#344b3e');
    const brass = this.material('#9a8051', .38, .55);
    this.box(26, .35, 52, 0, -.2, -8, floor);
    // Stone joints, physically placed in the floor plane.
    const seam = this.material('#a69e89');
    for (let x = -12; x <= 12; x += 3) this.box(.015, .006, 52, x, -.018, -8, seam);
    for (let z = -32; z <= 16; z += 3) this.box(26, .006, .015, 0, -.018, z, seam);
    this.box(26, 8, .6, 0, 4, -34, dark);
    for (const side of [-1, 1]) {
      this.box(.6, 8, 52, side * 13, 4, -8, plaster);
      this.box(.16, .22, 51, side * 12.65, .2, -8, stone);
      for (let z = 11; z > -34; z -= 8) {
        this.box(1.05, 6, .85, side * 11.6, 3, z, stone);
        this.box(1.35, .28, 1.15, side * 11.6, .18, z, stone);
        this.box(1.4, .3, 1.1, side * 11.6, 5.95, z, stone);
      }
    }
    // A succession of arches frames the central walkway under a clerestory.
    const archMaterial = this.material('#d6cbb3');
    for (let z = 11; z >= -29; z -= 8) {
      const shape = new THREE.Shape();
      shape.moveTo(-11.8, 5.9); shape.lineTo(-11.8, 9); shape.lineTo(11.8, 9); shape.lineTo(11.8, 5.9);
      shape.lineTo(10.6, 5.9);
      shape.absellipse(0, 5.9, 10.6, 2.7, 0, Math.PI, false, 0);
      shape.lineTo(-11.8, 5.9);
      const arch = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: .65, bevelEnabled: false, curveSegments: 28 }), archMaterial);
      arch.position.z = z; arch.castShadow = true; arch.receiveShadow = true; this.gallery.add(arch);
      for (const x of [-7.5, 7.5]) {
        const light = this.box(3.8, .04, .14, x, 6.7, z - 2.8, new THREE.MeshBasicMaterial({ color: '#fff5d2' }));
        light.castShadow = false;
      }
    }
    for (const x of [-9.8, 9.8]) this.box(5, .25, 51, x, 7.9, -8, plaster);
    for (let z = -31; z < 15; z += 2) this.box(.12, .15, .12, 0, 9, z, brass);
    const heading = this.label(english ? 'Following the wine trail' : 'Şərabın izi ilə', 15, 2.3, '#efe8d4', null, '500 115px "Cormorant Garamond"');
    heading.position.set(0, 5.25, -33.64); this.gallery.add(heading);
    const sub = this.label(english ? 'FROM SOIL TO MEMORY' : 'TORPAQDAN YADDAŞA', 9, .65, '#d7c6a0', null, '500 48px Manrope');
    sub.position.set(0, 3.8, -33.63); this.gallery.add(sub);
    // A quiet central bench and inset route inlay leave generous movement lanes.
    for (const z of [-5, -21]) {
      this.box(3.3, .18, 1, 0, .58, z, this.material('#78624b'));
      for (const x of [-1.2, 1.2]) this.box(.18, .5, .75, x, .25, z, dark);
      this.colliders.push({ x: 0, z, w: 3.3, d: 1 });
    }
    for (let z = 12; z > -30; z -= 1.2) this.box(.025, .007, .32, -2.5, -.005, z, brass);
    exhibits.forEach((exhibit, index) => {
      const [x, , z] = exhibit.position;
      const diorama = !!exhibit.environment;
      const width = diorama ? 4.8 : 2.2, depth = diorama ? 3.8 : 2.2;
      this.box(width, 1.05, depth, x, .525, z, plaster);
      this.box(width + .08, .09, depth + .08, x, 1.07, z, stone);
      this.box(width - .16, .06, depth - .16, x, .04, z, dark);
      this.colliders.push({ x, z, w: width, d: depth });
      const group = new THREE.Group(); group.position.set(x, 1.13, z); this.gallery.add(group);
      const placeholder = this.makeFallback(exhibit.size * .6);
      group.add(placeholder);
      const marker = new THREE.Mesh(new THREE.TorusGeometry(.12, .022, 8, 32), new THREE.MeshBasicMaterial({ color: '#355b46' }));
      marker.position.set(x, 1.52, z + depth / 2 + .1); marker.renderOrder = 3;
      marker.userData.exhibitIndex = index; this.gallery.add(marker); this.targets.push(marker);
      const name = this.label(exhibit.short, 2.6, .38, '#34483b', '#eee8d9', '600 66px Manrope');
      name.position.set(x, .73, z + depth / 2 + .012); this.gallery.add(name);
      const date = this.label(exhibit.date, 2.4, .28, '#686151', '#eee8d9', '500 48px Manrope');
      date.position.set(x, .38, z + depth / 2 + .016); this.gallery.add(date);
      const wallTitle = this.label(String(index + 1).padStart(2, '0') + '  /  ' + exhibit.period, 5.5, .7, '#6a634f', null, '500 54px Manrope');
      wallTitle.position.set(Math.sign(x) * 12.65, 4.1, z);
      wallTitle.rotation.y = -Math.sign(x) * Math.PI / 2; this.gallery.add(wallTitle);
      this.stations.push({ group, placeholder, marker, width, depth, loaded: false });
    });
    // A large sculptural vessel greets visitors; the credited original remains unchanged.
    this.loadModel('neck_amphora_wikimedia_cc_by_sa_4.0.stl').then(model => {
      const hero = this.normalize(model, 3.2); hero.position.set(2.6, .65, 9.6); hero.rotation.y = -.3;
      this.gallery.add(hero); hero.traverse(o => { if (o.isMesh) { o.userData.exhibitIndex = 0; this.targets.push(o); } });
    }).catch(() => {});
    this.box(3, .65, 3, 2.6, .325, 9.6, stone); this.colliders.push({ x: 2.6, z: 9.6, w: 3, d: 3 });
  }

  makeFallback(size) {
    // An explicitly illustrative ceramic silhouette remains if a model fails.
    const points = [[.08, 0], [.32, .15], [.58, .6], [.52, 1.05], [.23, 1.32], [.2, 1.7], [.3, 1.75]].map(([x,y]) => new THREE.Vector2(x,y));
    const mesh = new THREE.Mesh(new THREE.LatheGeometry(points, 32), clay);
    mesh.scale.setScalar(size / 1.75); mesh.castShadow = true; return mesh;
  }
  async loadModel(file) {
    if (!this.cache.has(file)) {
      const promise = file.endsWith('.stl')
        ? new STLLoader().loadAsync(modelUrl(file)).then(geometry => {
          geometry.rotateX(-Math.PI / 2); geometry.computeVertexNormals();
          return new THREE.Mesh(geometry, clay);
        })
        : new GLTFLoader().loadAsync(modelUrl(file)).then(gltf => gltf.scene);
      this.cache.set(file, promise);
      promise.catch(() => this.cache.delete(file));
    }
    return (await this.cache.get(file)).clone(true);
  }
  normalize(model, size, fit = 'max') {
    const group = new THREE.Group(); group.add(model);
    const b = new THREE.Box3().setFromObject(model), d = b.getSize(new THREE.Vector3());
    const center = b.getCenter(new THREE.Vector3());
    model.position.sub(center); model.position.y += d.y / 2;
    group.scale.setScalar(size / (fit === 'height' ? d.y : Math.max(d.x, d.y, d.z)));
    group.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return group;
  }
  async loadExhibits() {
    let done = 0;
    const load = async index => {
      const exhibit = exhibits[index], station = this.stations[index];
      try {
        const model = this.normalize(await this.loadModel(exhibit.model), exhibit.size);
        station.group.remove(station.placeholder); station.group.add(model); station.loaded = true;
        if (!exhibit.environment) model.rotation.y = -.18;
        model.traverse(o => { if (o.isMesh) { o.userData.exhibitIndex = index; this.targets.push(o); } });
      } catch (error) {
        station.placeholder.userData.exhibitIndex = index; this.targets.push(station.placeholder);
        this.callbacks.modelError(index);
      }
      this.callbacks.progress(++done, exhibits.length);
    };
    let next = 0;
    await Promise.all(Array.from({ length: 3 }, async () => { while (next < exhibits.length) await load(next++); }));
  }

  resize() {
    const { clientWidth: width, clientHeight: height } = this.container;
    this.camera.aspect = width / height; this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  setQuality(quality) {
    this.settings.quality = quality;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'low' ? 1 : 1.6));
    this.renderer.shadowMap.enabled = quality !== 'low'; this.scene.traverse(o => { if (o.material) for (const m of [].concat(o.material)) m.needsUpdate = true; });
    this.resize();
  }
  start() {
    this.exploring = true; this.selected = null;
    this.flyTo(vec(0, 1.7, 13.6), vec(0, 1.7, -10));
  }
  stopInput() { this.keys.clear(); this.joystick.x = this.joystick.y = 0; this.drag = null; }
  block(value) { this.blocked = value; this.stopInput(); if (value) this.unlock(); }
  async lock() {
    if (this.blocked || this.selected !== null || !this.exploring) return;
    try { await this.renderer.domElement.requestPointerLock(); } catch { this.callbacks.toast(english ? 'Click and drag to look around.' : 'Siçanı basılı tutub sürüşdürərək ətrafa baxın.'); }
  }
  unlock() { if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock(); }
  bindInput() {
    const canvas = this.renderer.domElement;
    const updatePointer = event => {
      const rect = canvas.getBoundingClientRect();
      this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    };
    window.addEventListener('keydown', e => {
      if (e.target.closest('input,select,textarea,dialog') || this.blocked || !this.exploring) return;
      if (['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft'].includes(e.code) && this.selected === null) {
        if (e.target.closest('button,a')) return;
        e.preventDefault(); this.keys.add(e.code); this.motion = null;
      }
      if (e.code === 'KeyE' && this.hovered >= 0 && this.selected === null) this.callbacks.select(this.hovered);
    });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.stopInput());
    document.addEventListener('visibilitychange', () => this.stopInput());
    document.addEventListener('pointerlockchange', () => { this.stopInput(); this.callbacks.lock(document.pointerLockElement === canvas); });
    document.addEventListener('pointerlockerror', () => this.callbacks.toast(english ? 'Click and drag to look; use WASD to walk.' : 'Siçanı basılı saxlayıb sürüşdürün; WASD ilə yeriyin.'));
    canvas.addEventListener('pointerdown', e => {
      if (!this.exploring || this.blocked) return;
      updatePointer(e);
      canvas.focus({ preventScroll: true });
      this.drag = { x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, distance: 0 };
      if (!document.pointerLockElement) canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', e => {
      updatePointer(e);
      if (!this.exploring || this.blocked) return;
      let dx = 0, dy = 0;
      if (document.pointerLockElement === canvas) { dx = e.movementX; dy = e.movementY; }
      else if (this.drag) {
        dx = e.clientX - this.drag.x; dy = e.clientY - this.drag.y;
        this.drag.distance += Math.abs(dx) + Math.abs(dy); this.drag.x = e.clientX; this.drag.y = e.clientY;
      }
      if (dx || dy) {
        this.motion = null;
        if (this.selected !== null && this.orbit) {
          this.orbit.theta -= dx * .006; this.orbit.phi = bound(this.orbit.phi + dy * .005, .3, 1.95); this.updateOrbit();
        } else {
          this.camera.rotation.y -= dx * .0026;
          this.camera.rotation.x = bound(this.camera.rotation.x - dy * .0026, -1.25, 1.25);
        }
      }
    });
    canvas.addEventListener('pointerup', e => {
      if (this.drag && this.drag.distance < 8 && this.selected === null) {
        updatePointer(e);
        const hit = this.pick(document.pointerLockElement ? new THREE.Vector2(0,0) : this.pointer);
        if (hit >= 0) this.callbacks.select(hit);
      }
      this.drag = null; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointercancel', () => this.drag = null);
    canvas.addEventListener('wheel', e => {
      if (this.orbit && this.selected !== null) { e.preventDefault(); this.motion = null; this.orbit.radius = bound(this.orbit.radius + e.deltaY * .006, 2.5, 11); this.updateOrbit(); }
    }, { passive: false });
  }
  visibleTargets() { return this.currentEnvironment === 'gallery' ? this.targets : this.outdoorTargets || []; }
  pick(pointer) {
    this.raycaster.setFromCamera(pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.visibleTargets(), false)[0];
    return hit && hit.distance < 30 ? hit.object.userData.exhibitIndex : -1;
  }
  updateOrbit() {
    const o = this.orbit;
    this.camera.position.copy(o.target).add(new THREE.Vector3().setFromSphericalCoords(o.radius, o.phi, o.theta));
    this.camera.lookAt(o.target);
  }
  flyTo(position, target) {
    const from = this.camera.position.clone(), q = this.camera.quaternion.clone();
    const temp = this.camera.clone(); temp.position.copy(position); temp.lookAt(target);
    if (this.settings.reducedMotion) { this.camera.position.copy(position); this.camera.quaternion.copy(temp.quaternion); return; }
    this.motion = { from, to: position, q, toQ: temp.quaternion.clone(), start: performance.now(), duration: 850 };
  }
  async focus(index) {
    if (this.currentEnvironment !== 'gallery') await this.changeEnvironment('gallery');
    ++this.sceneToken; this.callbacks.sceneLoading(false);
    this.unlock(); this.stopInput(); this.exploring = true; this.selected = index;
    const exhibit = exhibits[index]; const [x,,z] = exhibit.position;
    const target = vec(x, 2, z);
    this.orbit = { target, radius: exhibit.environment ? 7 : 5.8, phi: 1.32, theta: -.2 };
    const to = target.clone().add(new THREE.Vector3().setFromSphericalCoords(this.orbit.radius, this.orbit.phi, this.orbit.theta));
    this.flyTo(to, target);
  }
  leaveExhibit() {
    this.selected = null; this.orbit = null; this.stopInput();
    // Return to eye height and an unobstructed central walkway.
    const z = bound(this.camera.position.z, -30, 14);
    this.flyTo(vec(0, 1.7, z), vec(0, 1.7, z - 10));
  }
  reset() {
    if (this.selected !== null) return this.focus(this.selected);
    if (this.currentEnvironment !== 'gallery') this.flyTo(vec(0, 1.7, 18), vec(0, 2, 0));
    else this.start();
  }
  turn(amount) { if (this.selected !== null && this.orbit) { this.motion = null; this.orbit.theta += amount; this.updateOrbit(); } else this.camera.rotation.y += amount; }
  zoom(amount) { if (this.orbit) { this.motion = null; this.orbit.radius = bound(this.orbit.radius + amount, 2.5, 11); this.updateOrbit(); } }
  finishTransition() { if (this.motion) { this.camera.position.copy(this.motion.to); this.camera.quaternion.copy(this.motion.toQ); this.motion = null; } if (this.assembly) { this.outdoor.position.y = 0; this.assembly = null; } }
  async changeEnvironment(id) {
    const token = ++this.sceneToken;
    this.motion = null; this.assembly = null;
    this.unlock(); this.stopInput(); this.selected = null; this.orbit = null; this.exploring = true;
    this.callbacks.sceneLoading(true);
    const env = environments.find(e => e.id === id) || environments[0];
    if (env.id === 'gallery') {
      this.gallery.visible = true; this.outdoor.visible = false; this.currentEnvironment = 'gallery';
      this.scene.background.set('#d4d4c4'); this.scene.fog.color.set('#e4e1d4');
      this.start(); this.callbacks.sceneLoading(false); return true;
    }
    try {
      const model = this.normalize(await this.loadModel(env.file), env.id === 'prehistoric' ? 19 : 25);
      if (token !== this.sceneToken) return false;
      this.outdoor.clear(); this.outdoor.position.y = 0;
      this.outdoor.add(model);
      const ground = this.box(90, .2, 90, 0, -.16, 0, this.material('#b7b79b'), this.outdoor); ground.castShadow = false;
      this.outdoorColliders = [];
      model.updateMatrixWorld(true);
      model.traverse(o => {
        if (!o.isMesh) return;
        const b = new THREE.Box3().setFromObject(o), s = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
        if (b.max.y > .6 && b.min.y < 1.65 && s.y > .5 && s.x < 18 && s.z < 18 && s.x * s.z > .08) this.outdoorColliders.push({ x: c.x, z: c.z, w: s.x, d: s.z });
      });
      const info = this.makeFallback(1.6); info.position.set(5, .7, 9); info.userData.exhibitIndex = env.exhibit;
      this.outdoor.add(info); this.outdoorTargets = [info];
      this.box(1.8, .7, 1.8, 5, .35, 9, this.material('#ddd5c1'), this.outdoor);
      this.outdoorColliders.push({ x: 5, z: 9, w: 1.8, d: 1.8 });
      const plaque = this.label(english ? 'Open story' : 'Hekayəni aç', 1.6, .32, '#f4edda', '#29483b', '500 100px Manrope');
      plaque.position.set(5, .43, 9.91); plaque.userData.exhibitIndex = env.exhibit;
      this.outdoor.add(plaque); this.outdoorTargets.push(plaque);
      this.outdoor.visible = true; this.gallery.visible = false; this.currentEnvironment = env.id;
      this.scene.background.set(env.id === 'medieval' ? '#c7d0cd' : '#ccd9d7'); this.scene.fog.color.copy(this.scene.background);
      this.camera.position.set(0, 1.7, 23); this.camera.lookAt(0, env.id === 'prehistoric' ? 4.5 : 2.2, 0);
      if (!this.settings.reducedMotion) { this.outdoor.position.y = -.6; this.assembly = performance.now(); }
      this.callbacks.sceneLoading(false); return true;
    } catch (error) {
      if (token !== this.sceneToken) return false;
      this.callbacks.sceneLoading(false); this.callbacks.toast(english ? 'The environment could not load. The gallery and information remain available; please try again.' : 'Mühit yüklənmədi. Qalereya və məlumatlar əlçatandır; yenidən cəhd edin.'); return false;
    }
  }
  collides(x, z) {
    const list = this.currentEnvironment === 'gallery' ? this.colliders : this.outdoorColliders || [];
    const radius = .34;
    return list.some(b => Math.abs(x - b.x) < b.w / 2 + radius && Math.abs(z - b.z) < b.d / 2 + radius);
  }
  move(dt) {
    if (!this.exploring || this.blocked || this.selected !== null || this.motion) return;
    const keys = this.keys;
    let forward = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown')) - this.joystick.y;
    let right = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft')) + this.joystick.x;
    const magnitude = Math.hypot(forward, right);
    if (!magnitude) return;
    if (magnitude > 1) { forward /= magnitude; right /= magnitude; }
    const speed = (keys.has('ShiftLeft') ? 6.5 : 3.4) * dt;
    const yaw = this.camera.rotation.y;
    const dx = (-Math.sin(yaw) * forward + Math.cos(yaw) * right) * speed;
    const dz = (-Math.cos(yaw) * forward - Math.sin(yaw) * right) * speed;
    const outdoor = this.currentEnvironment !== 'gallery';
    const x = bound(this.camera.position.x + dx, outdoor ? -28 : -11, outdoor ? 28 : 11);
    const z = bound(this.camera.position.z + dz, outdoor ? -28 : -31.6, outdoor ? 28 : 15.8);
    if (!this.collides(x, this.camera.position.z)) this.camera.position.x = x;
    if (!this.collides(this.camera.position.x, z)) this.camera.position.z = z;
    this.camera.position.y = 1.7;
  }
  frame(time) {
    if (document.hidden) { this.lastTick = time; return; }
    const dt = Math.min((time - (this.lastTick || time)) / 1000, .045); this.lastTick = time;
    this.move(dt);
    if (this.motion) {
      const m = this.motion, t = bound((performance.now() - m.start) / m.duration, 0, 1), ease = 1 - (1 - t) ** 3;
      this.camera.position.lerpVectors(m.from, m.to, ease); this.camera.quaternion.slerpQuaternions(m.q, m.toQ, ease);
      if (t === 1) this.motion = null;
    }
    if (this.assembly) { const t = bound((performance.now() - this.assembly) / 800, 0, 1); this.outdoor.position.y = -.6 * (1 - t) ** 3; if (t === 1) this.assembly = null; }
    this.elapsed += dt;
    if (this.elapsed > .1 && this.exploring && !this.blocked && this.selected === null) {
      this.elapsed = 0;
      const index = this.pick(document.pointerLockElement ? new THREE.Vector2(0,0) : this.pointer);
      if (index !== this.hovered) { this.hovered = index; this.callbacks.hover(index); this.renderer.domElement.style.cursor = index >= 0 ? 'pointer' : 'grab'; }
      this.callbacks.position(this.camera.position.x, this.camera.position.z, this.camera.rotation.y);
    }
    this.renderer.render(this.scene, this.camera);
  }
}
