/* Landing page effects: the fixed WebGL moon behind the landing page and Lenis smooth scroll
   (the staggered reveal lives in app.js, so the copy never waits for the CDN). Ported from the "Ascend" GetLayers template prompt (three r0.143),
   with the Earth swapped for a moon whose surface is painted in code.
   Runs only on the landing page: app.js calls GW.landing.enter() after rendering it and
   GW.landing.leave() when the route changes. The scene is built once and paused while away. */
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Lenis from "https://unpkg.com/lenis@1.3.23/dist/lenis.mjs";


const CONFIG = {
  rimColor: "#c1faff", rimPower: 2.4, nightLights: 10, terrainDepth: 0.33, terrainShade: 1.3,
  oceanGlint: 0.45, oceanDeep: 0.12, oceanFlow: 3, oceanFlowSpeed: 0.8, oceanFlowScale: 2.1,
  glowColor: "#80B4F0", glowIntensity: 0.12, planetRadius: 1.95, spin: 0.03, initRotation: 2.07,
  tilt: 0.37, autoRotate: 0,
  cloud1Height: 1.005, cloud1Opacity: 0.6, cloud1Spin: 0.06,
  cloud2Height: 1.03, cloud2Opacity: 0.5, cloud2Spin: 0.14,
  cloud3Height: 1.075, cloud3Opacity: 0.5, cloud3Spin: 0.1,
  bgColor: "#0B0B0A", flameColor: "#80B4F0", flameColor2: "#CFCCC6", flameAmt: 0.03,
  atmoColor: "#CFCCC6", atmoCount: 320, atmoSize: 22, atmoSpeed: 0.8,
  starColor: "#F4F3F0", starCount: 1400, starSize: 1.6, starFlicker: 1,
  markerColor: "#E2B25C", markerCount: 60, markerSize: 16, markerSpeed: 0.5,
};
// moon surface: relief from the painted craters, and the faint earthshine left on the night side
// sunlight on the albedo, depth of the painted relief, fine roughness and the earthshine left on the night side
const MOON = { sun: 1.0, relief: 0.2, reliefModel: 0.022, micro: 0.006, earthshine: 0.012 };
// NASA's moon model (solarsystem.nasa.gov, public domain, credit NASA): a textured low-poly sphere
const MOON_GLB = "assets/moon/moon.glb";
const LAYERS = { NONE: 0, TORUS_SCENE: 1, BLOOM_SCENE: 2, ENTIRE_SCENE: 3 };

const STOPS_X = [{ p: 0, v: 0 }, { p: 0.32, v: -3.1 }, { p: 0.64, v: 3.2 }, { p: 1, v: 0 }];
const STOPS_Y = [{ p: 0, v: -4.5 }, { p: 0.32, v: 0.55 }, { p: 0.64, v: 0.45 }, { p: 1, v: 0.15 }];
const STOPS_S = [{ p: 0, v: 2.15 }, { p: 0.32, v: 1.0 }, { p: 0.64, v: 0.92 }, { p: 1, v: 1.12 }];
const ENTRY_DUR = 1.9, ENTRY_START_Y = -6.5;

const Lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
function hexToVec3(hex) { const c = new THREE.Color(hex); return new THREE.Vector3(c.r, c.g, c.b); }
function sample(stops, p) {
  if (p <= stops[0].p) return stops[0].v;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i], b = stops[i + 1];
    if (p <= b.p) { let t = (p - a.p) / (b.p - a.p); t = t * t * (3 - 2 * t); return Lerp(a.v, b.v, t); }
  }
  return stops[stops.length - 1].v;
}

const SNOISE = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx; vec3 x2 = x0 - i2 + 2.0 * C.xxx; vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;

const FinalPass = {
  uniforms: {
    iTime: { value: 0 }, tDiffuse: { value: null }, torusTexture: { value: null }, bloomTexture: { value: null }, haloTexture: { value: null },
    uBg: { value: hexToVec3(CONFIG.bgColor) }, uFlameA: { value: hexToVec3(CONFIG.flameColor) },
    uFlameB: { value: hexToVec3(CONFIG.flameColor2) }, uFlameAmt: { value: CONFIG.flameAmt },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`,
  fragmentShader: `
    uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture; uniform sampler2D haloTexture;
    uniform vec3 uBg; uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
    varying vec2 vUv;
    vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
      pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
      pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
      pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
      return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
    void main(){
      vec2 uv = 2.*vUv - 1.;
      vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
      vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
      flame *= smoothstep(0.25, 1., abs(uv.y));
      float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
      vec3 bg = uBg * (1.0 - 0.4 * length(uv));
      vec3 halo = texture2D(haloTexture, vUv).xyz;
      gl_FragColor = vec4(bg + flame*uFlameAmt + texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz + halo, 1.);
    }`,
};

const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
let scene = null, active = false, lenis = null;

function supportsWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch (e) { return false; }
}

function buildScene(canvas) {
  const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const sc = new THREE.Scene();
  sc.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 0, 8);
  camera.layers.enable(LAYERS.TORUS_SCENE); camera.layers.enable(LAYERS.BLOOM_SCENE); camera.layers.enable(LAYERS.ENTIRE_SCENE);
  sc.add(camera);

  // lights reach every pass, so each composer sees them
  const amb = new THREE.AmbientLight(0xffffff, 1.8), dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(0, 10, 2);
  [amb, dir].forEach((l) => { l.layers.set(LAYERS.ENTIRE_SCENE); l.layers.enable(LAYERS.TORUS_SCENE); l.layers.enable(LAYERS.BLOOM_SCENE); sc.add(l); });

  const w = innerWidth, h = innerHeight;
  const torusComposer = new EffectComposer(renderer); torusComposer.renderToScreen = false;
  torusComposer.addPass(new RenderPass(sc, camera));
  torusComposer.addPass(new ShaderPass(GammaCorrectionShader));
  torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.22, 0.2, 0));
  torusComposer.addPass(new ShaderPass(CopyShader));
  const bloomComposer = new EffectComposer(renderer); bloomComposer.renderToScreen = false;
  bloomComposer.addPass(new RenderPass(sc, camera));
  bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.6, 0));
  bloomComposer.addPass(new ShaderPass(GammaCorrectionShader));
  const finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(new RenderPass(sc, camera));
  const finalPass = new ShaderPass(FinalPass);
  finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
  finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;
  finalComposer.addPass(finalPass);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.06; controls.enablePan = false; controls.enabled = false;
  controls.autoRotate = true; controls.autoRotateSpeed = CONFIG.autoRotate;
  controls.minDistance = 3.5; controls.maxDistance = 16; controls.target.set(0, 0, 0);

  const worldGroup = new THREE.Group(), planetGroup = new THREE.Group(), cloudGroup = new THREE.Group();
  planetGroup.rotation.z = CONFIG.tilt; cloudGroup.rotation.z = CONFIG.tilt; cloudGroup.visible = false;
  worldGroup.add(planetGroup, cloudGroup); sc.add(worldGroup);
  worldGroup.position.set(STOPS_X[0].v, STOPS_Y[0].v, 0); worldGroup.scale.setScalar(STOPS_S[0].v);

  const uRes = { value: new THREE.Vector2(w, h) };
  const shared = { planetTime: { value: 0 }, cloudTime: { value: 0 } };

  // atmosphere halo
  const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: { uGlow: { value: hexToVec3(CONFIG.glowColor) }, uIntensity: { value: CONFIG.glowIntensity } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 uGlow; uniform float uIntensity; varying vec2 vUv;
      void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.2); gl_FragColor = vec4(uGlow * a * uIntensity, a); }`,
    transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  glowMesh.scale.setScalar(CONFIG.planetRadius * 2.3);
  glowMesh.layers.set(LAYERS.ENTIRE_SCENE);
  worldGroup.add(glowMesh);

  // ambient motes
  const atmoGeo = new THREE.BufferGeometry(), ac = CONFIG.atmoCount;
  const aPos = new Float32Array(ac * 3), aSize = new Float32Array(ac), aSeed = new Float32Array(ac);
  for (let i = 0; i < ac; i++) { aPos[i * 3] = Math.random() * 2 - 1; aPos[i * 3 + 1] = Math.random() * 2 - 1; aPos[i * 3 + 2] = Math.random() * 2 - 1; aSize[i] = CONFIG.atmoSize * (0.4 + Math.random()); aSeed[i] = Math.random(); }
  atmoGeo.setAttribute("position", new THREE.BufferAttribute(aPos, 3)); atmoGeo.setAttribute("size", new THREE.BufferAttribute(aSize, 1)); atmoGeo.setAttribute("seed", new THREE.BufferAttribute(aSeed, 1));
  const atmoMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uRes, uColor: { value: hexToVec3(CONFIG.atmoColor) } },
    vertexShader: `attribute float size; attribute float seed; uniform float uTime; uniform vec2 uRes;
      varying float vA;
      vec3 warp(vec3 p, float t){ float c=0.9,a=1.9,b=0.02,s=0.05; p*=2.;
        p.x+=c*sin(s*t+a*p.y)+t*b; p.y+=c*cos(s*t+a*p.x); p.y+=c*sin(s*t+a*p.z)+t*b;
        p.z+=c*cos(s*t+a*p.y); p.z+=c*sin(s*t+a*p.x)+t*b; p.x+=c*cos(s*t+a*p.z);
        return cos(p+vec3(1,2,4)); }
      void main(){
        vec3 v = position*4.0 + warp(position, uTime)*1.2;
        vec4 mv = modelViewMatrix * vec4(v, 1.0);
        float r = length(v); float farF = 1.0 - smoothstep(5.0, 6.5, r); float nearF = smoothstep(0.0, 0.5, -mv.z);
        vA = farF * nearF;
        gl_PointSize = size * uRes.y / 900.0 / -mv.z; gl_PointSize = max(gl_PointSize, 1.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform vec3 uColor; varying float vA;
      void main(){ vec2 p = gl_PointCoord - 0.5; float l = length(p); if (l > 0.5) discard;
        float tex = smoothstep(0.5, 0.0, l); gl_FragColor = vec4(uColor * tex, tex * vA * 0.55); }`,
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  });
  const atmo = new THREE.Points(atmoGeo, atmoMat);
  atmo.frustumCulled = false; atmo.layers.set(LAYERS.BLOOM_SCENE);
  atmo.onBeforeRender = () => { const t = performance.now() / 1000 * CONFIG.atmoSpeed * 8; atmoMat.uniforms.uTime.value = t; finalPass.uniforms.iTime.value = t; };
  sc.add(atmo);

  // starfield
  const sc2 = CONFIG.starCount, sPos = new Float32Array(sc2 * 3), sSeed = new Float32Array(sc2), sBright = new Float32Array(sc2);
  for (let i = 0; i < sc2; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = Math.sqrt(1 - u * u);
    sPos[i * 3] = 90 * r * Math.cos(th); sPos[i * 3 + 1] = 90 * u; sPos[i * 3 + 2] = 90 * r * Math.sin(th);
    sSeed[i] = Math.random() * 100; sBright[i] = 0.35 + Math.random() * 0.65;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3)); starGeo.setAttribute("seed", new THREE.BufferAttribute(sSeed, 1)); starGeo.setAttribute("bright", new THREE.BufferAttribute(sBright, 1));
  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSize: { value: CONFIG.starSize }, uFlicker: { value: CONFIG.starFlicker }, uColor: { value: hexToVec3(CONFIG.starColor) }, uRes },
    vertexShader: `attribute float seed; attribute float bright;
      uniform float uTime; uniform float uSize; uniform float uFlicker; uniform vec2 uRes;
      varying float vTw;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float tw = 0.6 + 0.4 * sin(uTime * uFlicker + seed);
        vTw = bright * tw;
        gl_PointSize = max(uSize * uRes.y / 900.0 * (90.0 / max(-mv.z, 1.0)), 1.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform vec3 uColor; varying float vTw;
      void main(){ vec2 p = gl_PointCoord - 0.5; float l = length(p); if (l > 0.5) discard;
        float core = smoothstep(0.5, 0.0, l); gl_FragColor = vec4(uColor, core * vTw); }`,
    transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false; stars.layers.set(LAYERS.BLOOM_SCENE);
  sc.add(stars);

  const st = {
    renderer, sc, camera, controls, torusComposer, bloomComposer, finalComposer, finalPass, worldGroup, planetGroup, cloudGroup, glowMesh,
    atmo, atmoMat, starMat, uRes, shared, clouds: [], markerMat: null, planetMesh: null,
    curP: 0, curX: STOPS_X[0].v, curY: STOPS_Y[0].v, curS: STOPS_S[0].v, spinPhase: 0, starTime: 0, markerTime: 0,
    loadedAt: 0, last: 0, raf: 0,
  };
  // load the moon after the first frame, so the hero shows before the work starts
  setTimeout(() => buildMoon(st), 60);
  return st;
}

// The moon is painted in code as two maps. The albedo map holds only surface brightness (dark maria,
// bright highlands, young craters and their rays), with no light or shadow baked in. The height map holds
// the shape (crater bowls, raised rims, central peaks, smooth low maria). The shader lights the height
// with the sun, adds fine roughness from 3D noise, and shades with Lommel-Seeliger reflectance, the
// model that fits the moon's dusty surface, so the craters only cast shadows where the light falls.
function makeMoonMaps(W) {
  const H = W / 2;
  const ac = document.createElement("canvas"), hc = document.createElement("canvas");
  ac.width = hc.width = W; ac.height = hc.height = H;
  const a = ac.getContext("2d"), h = hc.getContext("2d");
  let seed = 23; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const wrap = (fn) => { fn(0); fn(-W); fn(W); };   // draw across the seam so the sphere has no join
  const blob = (g, x, y, r, inner, outer, sx) => wrap((o) => {
    g.save(); g.translate(x + o, y); g.scale(sx || 1, 1);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill(); g.restore();
  });
  const stretch = (y) => 1 / Math.max(0.22, Math.cos((y / H - 0.5) * Math.PI));

  // highlands: warm light grey with broad, soft variation
  a.fillStyle = "#a9a59d"; a.fillRect(0, 0, W, H);
  h.fillStyle = "#808080"; h.fillRect(0, 0, W, H);
  for (let i = 0; i < 160; i++) {
    const x = rnd() * W, y = H * (0.05 + rnd() * 0.9), r = W * (0.01 + rnd() * 0.05), up = rnd() < 0.5;
    blob(a, x, y, r, up ? "rgba(255,250,240,0.07)" : "rgba(40,38,36,0.08)", "rgba(0,0,0,0)", stretch(y));
    blob(h, x, y, r, up ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", "rgba(0,0,0,0)", stretch(y));
  }
  // maria: dark, smooth, low basins with ragged edges, clustered on one hemisphere as on the near side
  const maria = [[0.27, 0.36, 0.10], [0.35, 0.29, 0.07], [0.21, 0.50, 0.09], [0.40, 0.45, 0.06], [0.32, 0.61, 0.055], [0.46, 0.35, 0.045], [0.17, 0.32, 0.05], [0.29, 0.45, 0.06], [0.73, 0.43, 0.035]];
  maria.forEach(([mx, my, mr]) => {
    for (let k = 0; k < 40; k++) {
      const ang = rnd() * Math.PI * 2, dist = Math.pow(rnd(), 0.6) * mr;
      const x = (mx + Math.cos(ang) * dist * 1.3) * W, y = (my + Math.sin(ang) * dist * 1.6) * H, r = mr * W * (0.12 + rnd() * 0.3);
      blob(a, x, y, r, "rgba(58,58,62,0.42)", "rgba(58,58,62,0)", stretch(y));
      blob(h, x, y, r, "rgba(0,0,0,0.16)", "rgba(0,0,0,0)", stretch(y));
    }
  });
  // craters: a power-law size spread (many small, few large). Height: a bowl, a raised rim, a central peak
  // on larger ones. Albedo: mostly unchanged, a little brighter on fresh rims.
  const crater = (x, y, r, fresh) => {
    const sx = stretch(y);
    wrap((o) => {
      h.save(); h.translate(x + o, y); h.scale(sx, 1);
      const bowl = h.createRadialGradient(0, 0, 0, 0, 0, r * 1.25);
      // a parabolic bowl that rises to a narrow rim, then ejecta that fades out
      bowl.addColorStop(0, "rgba(0,0,0,0.42)"); bowl.addColorStop(0.35, "rgba(0,0,0,0.34)"); bowl.addColorStop(0.6, "rgba(0,0,0,0.14)");
      bowl.addColorStop(0.74, "rgba(255,255,255,0.20)"); bowl.addColorStop(0.84, "rgba(255,255,255,0.08)"); bowl.addColorStop(1, "rgba(255,255,255,0)");
      h.fillStyle = bowl; h.beginPath(); h.arc(0, 0, r * 1.25, 0, Math.PI * 2); h.fill();
      if (r > W * 0.004) { const pk = h.createRadialGradient(0, 0, 0, 0, 0, r * 0.22); pk.addColorStop(0, "rgba(255,255,255,0.35)"); pk.addColorStop(1, "rgba(255,255,255,0)"); h.fillStyle = pk; h.beginPath(); h.arc(0, 0, r * 0.22, 0, Math.PI * 2); h.fill(); }
      h.restore();
      a.save(); a.translate(x + o, y); a.scale(sx, 1);
      const ring = a.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 1.25);
      ring.addColorStop(0, "rgba(255,252,246,0)"); ring.addColorStop(0.65, fresh ? "rgba(255,252,246,0.22)" : "rgba(255,252,246,0.06)"); ring.addColorStop(1, "rgba(255,252,246,0)");
      a.fillStyle = ring; a.beginPath(); a.arc(0, 0, r * 1.25, 0, Math.PI * 2); a.fill();
      if (fresh) {   // bright ray systems thrown out by young impacts (albedo only, they have no height)
        a.strokeStyle = "rgba(255,253,248,0.07)"; a.lineCap = "round";
        for (let k = 0; k < 26; k++) { const t = rnd() * Math.PI * 2, len = r * (4 + rnd() * 12); a.lineWidth = Math.max(1, r * (0.05 + rnd() * 0.12)); a.beginPath(); a.moveTo(Math.cos(t) * r, Math.sin(t) * r); a.lineTo(Math.cos(t) * len, Math.sin(t) * len); a.stroke(); }
        const glow = a.createRadialGradient(0, 0, r, 0, 0, r * 3); glow.addColorStop(0, "rgba(255,253,248,0.14)"); glow.addColorStop(1, "rgba(255,253,248,0)"); a.fillStyle = glow; a.beginPath(); a.arc(0, 0, r * 3, 0, Math.PI * 2); a.fill();
      }
      a.restore();
    });
  };
  for (let i = 0; i < 4200; i++) { const r = W * 0.00035 * Math.pow(1 / (0.01 + rnd()), 1.15); crater(rnd() * W, H * (0.03 + rnd() * 0.94), Math.min(r, W * 0.04), false); }
  for (let i = 0; i < 9; i++) crater(rnd() * W, H * (0.15 + rnd() * 0.7), W * (0.0035 + rnd() * 0.005), true);
  // dither the 8-bit height, so low sunlight near the terminator shows no banding stripes
  const hd = h.getImageData(0, 0, W, H), px = hd.data;
  for (let i = 0; i < px.length; i += 4) { const n = (rnd() - 0.5) * 3; px[i] += n; px[i + 1] += n; px[i + 2] += n; }
  h.putImageData(hd, 0, 0);
  return { albedo: ac, height: hc };
}

// Lights a moon surface: height from a height map (or the albedo itself) plus fine 3D roughness, shaded
// with Lommel-Seeliger reflectance under a fixed sun, with faint earthshine on the night side.
function moonMaterial(st, tex, htex) {
  const aniso = Math.min(8, st.renderer.capabilities.getMaxAnisotropy()); tex.anisotropy = aniso; htex.anisotropy = aniso;
  const mat = new THREE.MeshStandardMaterial({ map: tex, metalness: 0, roughness: 1, envMapIntensity: 0 });
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      heightMap: { value: htex }, sunPower: { value: MOON.sun }, reliefDepth: { value: MOON.relief },
      microDepth: { value: MOON.micro }, earthshine: { value: MOON.earthshine },
    });
    shader.vertexShader = "varying vec2 vCustomUv; varying vec3 vObjPos;\n" + shader.vertexShader.replace("void main() {", "void main() {\n vCustomUv = uv; vObjPos = position;");
    shader.fragmentShader = `uniform sampler2D heightMap; uniform float sunPower; uniform float reliefDepth; uniform float microDepth; uniform float earthshine;
varying vec2 vCustomUv; varying vec3 vObjPos;
${SNOISE}
float moonMicro(vec3 p){ return snoise(p * 9.0) * 0.5 + snoise(p * 23.0) * 0.28 + snoise(p * 61.0) * 0.14; }
` + shader.fragmentShader.replace("#include <dithering_fragment>", `#include <dithering_fragment>
vec3 n0 = normalize(vNormal);
vec3 viewDir = normalize(vViewPosition);
float hgt = dot(texture2D(heightMap, vCustomUv).rgb, vec3(0.299, 0.587, 0.114)) * reliefDepth + moonMicro(normalize(vObjPos)) * microDepth;
vec3 surfPos = -vViewPosition;
vec3 sigX = dFdx(surfPos), sigY = dFdy(surfPos);
vec3 vR1 = cross(sigY, n0), vR2 = cross(n0, sigX);
float fDet = dot(sigX, vR1);
vec3 vGrad = sign(fDet) * (dFdx(hgt) * vR1 + dFdy(hgt) * vR2);
vec3 nB = normalize(abs(fDet) * n0 - vGrad);
vec3 sun = normalize(vec3(-0.9, 0.18, 0.4));
float mu0 = max(dot(nB, sun), 0.0), mu = max(dot(n0, viewDir), 0.04);
float ls = mu0 / (mu0 + mu);
float day = smoothstep(-0.02, 0.06, dot(n0, sun));
vec3 alb = diffuseColor.rgb * (0.94 + 0.06 * snoise(normalize(vObjPos) * 11.0));
vec3 col = alb * sunPower * ls * day + alb * earthshine * (1.0 - day);
gl_FragColor = vec4(col, 1.0);`);
  };
  return mat;
}

function addMoonMesh(st, geo, mat) {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.layers.set(LAYERS.TORUS_SCENE);
  st.planetGroup.add(mesh); st.planetMesh = mesh;
  buildMarkers(st, mesh);
  st.loadedAt = performance.now();
}

// NASA's mesh is coarse (about 2,000 vertices), so every triangle is split 16 ways and the new points are
// pushed out to the interpolated radius. The outline turns smooth, the texture mapping stays exactly as
// authored, and the mesh's own relief is kept.
function smoothSphere(src, levels) {
  const pos = src.attributes.position, uv = src.attributes.uv, idx = src.index;
  const triCount = idx ? idx.count / 3 : pos.count / 3, vi = (t, k) => (idx ? idx.getX(t * 3 + k) : t * 3 + k);
  const c = new THREE.Vector3(); for (let i = 0; i < pos.count; i++) c.add(new THREE.Vector3().fromBufferAttribute(pos, i)); c.divideScalar(pos.count);
  let meanR = 0; for (let i = 0; i < pos.count; i++) meanR += new THREE.Vector3().fromBufferAttribute(pos, i).distanceTo(c); meanR /= pos.count;
  const k = CONFIG.planetRadius / meanR, n = 1 << levels;
  const P = [], N = [], U = [], A = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], R = [0, 0, 0], T = [[0, 0], [0, 0], [0, 0]];
  const d = new THREE.Vector3(), q = new THREE.Vector3();
  const emit = (u, v) => {
    const w = 1 - u - v;
    q.set(0, 0, 0).addScaledVector(A[0], w).addScaledVector(A[1], u).addScaledVector(A[2], v);
    d.copy(q).sub(c).normalize();
    const r = (R[0] * w + R[1] * u + R[2] * v) * k;
    P.push(d.x * r, d.y * r, d.z * r); N.push(d.x, d.y, d.z);
    U.push(T[0][0] * w + T[1][0] * u + T[2][0] * v, T[0][1] * w + T[1][1] * u + T[2][1] * v);
  };
  for (let t = 0; t < triCount; t++) {
    for (let m = 0; m < 3; m++) { const i = vi(t, m); A[m].fromBufferAttribute(pos, i); R[m] = A[m].distanceTo(c); T[m][0] = uv.getX(i); T[m][1] = uv.getY(i); }
    for (let i = 0; i < n; i++) for (let j = 0; j < n - i; j++) {
      emit(i / n, j / n); emit((i + 1) / n, j / n); emit(i / n, (j + 1) / n);
      if (j < n - i - 1) { emit((i + 1) / n, j / n); emit((i + 1) / n, (j + 1) / n); emit(i / n, (j + 1) / n); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2));
  g.computeBoundingSphere();
  return g;
}

function buildMoon(st) {
  new GLTFLoader().load(MOON_GLB, (g) => {
    let src = null; g.scene.traverse((o) => { if (!src && o.isMesh) src = o; });
    if (!src || !src.material.map) { buildPaintedMoon(st); return; }
    // NASA's texture is 2048x1536. WebGL1 would shrink it to 2048x1024 to build mipmaps, so it is copied
    // onto a 2048x2048 canvas instead: every pixel kept, mipmaps intact, the UVs unchanged
    const img = src.material.map.image, cv = document.createElement("canvas");
    cv.width = cv.height = 2048; cv.getContext("2d").drawImage(img, 0, 0, 2048, 2048);
    const map = new THREE.CanvasTexture(cv);
    map.encoding = THREE.sRGBEncoding; map.flipY = src.material.map.flipY;
    const mat = moonMaterial(st, map, map);
    mat.onBeforeCompile = ((orig) => (sh) => { orig(sh); sh.uniforms.reliefDepth.value = MOON.reliefModel; })(mat.onBeforeCompile);
    addMoonMesh(st, smoothSphere(src.geometry, 2), mat);
  }, undefined, () => buildPaintedMoon(st));
}

// fallback if the model can't load: the moon painted in code
function buildPaintedMoon(st) {
  const size = innerWidth < 760 ? 2048 : 4096, maps = makeMoonMaps(size);
  const tex = new THREE.CanvasTexture(maps.albedo); tex.encoding = THREE.sRGBEncoding;
  const htex = new THREE.CanvasTexture(maps.height);
  addMoonMesh(st, new THREE.SphereGeometry(CONFIG.planetRadius, 256, 160), moonMaterial(st, tex, htex));
}

function buildMarkers(st, mesh) {
  const img = mesh.material.map && mesh.material.map.image;
  if (!img) return;
  // a 1024px copy is enough to tell land from ocean, and keeps the main thread free
  const sc = Math.min(1, 1024 / Math.max(img.width, img.height));
  const iw = Math.max(1, Math.round(img.width * sc)), ih = Math.max(1, Math.round(img.height * sc)), cv = document.createElement("canvas");
  cv.width = iw; cv.height = ih;
  const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0, iw, ih);
  let px; try { px = cx.getImageData(0, 0, iw, ih).data; } catch (e) { return; }
  const geo = mesh.geometry, pos = geo.attributes.position, uv = geo.attributes.uv, idx = geo.index;
  if (!uv) return;
  const triCount = idx ? idx.count / 3 : pos.count / 3, cum = new Float32Array(triCount);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), ab = new THREE.Vector3(), ac = new THREE.Vector3();
  const vi = (t, k) => (idx ? idx.getX(t * 3 + k) : t * 3 + k);
  let total = 0;
  for (let t = 0; t < triCount; t++) {
    a.fromBufferAttribute(pos, vi(t, 0)); b.fromBufferAttribute(pos, vi(t, 1)); c.fromBufferAttribute(pos, vi(t, 2));
    total += ab.subVectors(b, a).cross(ac.subVectors(c, a)).length() * 0.5; cum[t] = total;
  }
  const out = [], seeds = [], p = new THREE.Vector3();
  let tries = 0;
  while (out.length / 3 < CONFIG.markerCount && tries < 20000) {
    tries++;
    const r = Math.random() * total; let lo = 0, hi = triCount - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < r) lo = mid + 1; else hi = mid; }
    let u = Math.random(), v = Math.random(); if (u + v > 1) { u = 1 - u; v = 1 - v; } const wgt = 1 - u - v;
    const i0 = vi(lo, 0), i1 = vi(lo, 1), i2 = vi(lo, 2);
    const tu = uv.getX(i0) * wgt + uv.getX(i1) * u + uv.getX(i2) * v, tv = uv.getY(i0) * wgt + uv.getY(i1) * u + uv.getY(i2) * v;
    const xx = Math.min(iw - 1, Math.max(0, Math.floor((((tu % 1) + 1) % 1) * iw)));
    const yy = Math.min(ih - 1, Math.max(0, Math.floor((mesh.material.map.flipY ? 1 - (((tv % 1) + 1) % 1) : (((tv % 1) + 1) % 1)) * ih)));
    const o = (yy * iw + xx) * 4, cr = px[o], cg = px[o + 1], cb = px[o + 2];
    if (cb > cr + 6 && cb > cg + 6) continue;   // ocean
    a.fromBufferAttribute(pos, i0); b.fromBufferAttribute(pos, i1); c.fromBufferAttribute(pos, i2);
    p.set(0, 0, 0).addScaledVector(a, wgt).addScaledVector(b, u).addScaledVector(c, v).multiplyScalar(1.012);
    out.push(p.x, p.y, p.z); seeds.push(Math.random());
  }
  const mg = new THREE.BufferGeometry();
  mg.setAttribute("position", new THREE.Float32BufferAttribute(out, 3)); mg.setAttribute("seed", new THREE.Float32BufferAttribute(seeds, 1));
  const mm = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: hexToVec3(CONFIG.markerColor) }, uSize: { value: CONFIG.markerSize }, uSpeed: { value: CONFIG.markerSpeed }, uRes: st.uRes },
    vertexShader: `attribute float seed; uniform float uSize; uniform vec2 uRes;
      varying float vSeed; varying float vFade;
      void main(){
        vSeed = seed;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 vn = normalize(normalMatrix * normalize(position));
        vec3 vd = normalize(-mv.xyz);
        vFade = smoothstep(0.15, 0.5, dot(vn, vd));
        gl_PointSize = max(uSize * uRes.y / 900.0 * (7.0 / max(-mv.z, 1.0)), 2.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime; uniform float uSpeed;
      varying float vSeed; varying float vFade;
      void main(){
        if (vFade <= 0.001) discard;
        vec2 p = gl_PointCoord - 0.5;
        float d = length(p) * 2.0;
        if (d > 1.0) discard;
        float core = smoothstep(0.30, 0.0, d) * 1.2;
        float ph = fract(uTime * uSpeed + vSeed);
        float ring = smoothstep(0.07, 0.0, abs(d - ph)) * (1.0 - ph);
        gl_FragColor = vec4(uColor, clamp(core + ring, 0.0, 1.0) * vFade);
      }`,
    transparent: true, depthTest: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const markers = new THREE.Points(mg, mm);
  markers.layers.set(LAYERS.BLOOM_SCENE); markers.frustumCulled = false;
  mesh.add(markers); st.markerMat = mm;
}

function resize(st) {
  const w = innerWidth, h = innerHeight, dpr = window.devicePixelRatio;
  st.camera.aspect = w / h; st.camera.updateProjectionMatrix();
  st.renderer.setPixelRatio(dpr); st.renderer.setSize(w, h, false);
  [st.torusComposer, st.bloomComposer, st.finalComposer].forEach((c) => { c.setPixelRatio(dpr); c.setSize(w, h); });
  st.uRes.value.set(w, h);
}

function frame(now) {
  const st = scene; st.raf = 0;
  if (!active) return;
  const dt = Math.min(0.05, st.last ? (now - st.last) / 1000 : 0); st.last = now;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const pTarget = clamp(window.scrollY / max, 0, 1);
  st.curP += (pTarget - st.curP) * Math.min(1, dt * 4.5);
  const sideScale = clamp(innerWidth / 1200, 0.5, 1), k = Math.min(1, dt * 3.2);
  st.curX += (sample(STOPS_X, st.curP) * sideScale - st.curX) * k;
  st.curY += (sample(STOPS_Y, st.curP) - st.curY) * k;
  st.curS += (sample(STOPS_S, st.curP) - st.curS) * k;
  let entryY = 0;
  if (!reduced) {
    if (!st.loadedAt) entryY = ENTRY_START_Y;
    else { const t = clamp((now - st.loadedAt) / 1000 / ENTRY_DUR, 0, 1); entryY = Lerp(ENTRY_START_Y, 0, 1 - Math.pow(1 - t, 3)); }
  }
  st.worldGroup.position.set(st.curX, st.curY + entryY, 0);
  st.worldGroup.scale.setScalar(st.curS);
  st.spinPhase += dt * CONFIG.spin;
  st.planetGroup.rotation.y = CONFIG.initRotation + st.spinPhase + st.curP * Math.PI * 1.6;
  st.clouds.forEach((m) => { m.rotation.y += dt * CONFIG[m.userData.spinKey]; });
  st.glowMesh.quaternion.copy(st.camera.quaternion);
  st.atmo.position.copy(st.camera.position);
  st.shared.planetTime.value += dt / 12; st.shared.cloudTime.value += dt / 20;
  st.starTime += dt; st.starMat.uniforms.uTime.value = st.starTime;
  st.markerTime += dt; if (st.markerMat) st.markerMat.uniforms.uTime.value = st.markerTime;
  st.controls.update();
  st.camera.layers.set(LAYERS.TORUS_SCENE); st.torusComposer.render();
  st.camera.layers.set(LAYERS.BLOOM_SCENE); st.bloomComposer.render();
  st.camera.layers.set(LAYERS.ENTIRE_SCENE); st.finalComposer.render();
  st.raf = requestAnimationFrame(frame);
}

function onResize() { if (scene) resize(scene); }

function lenisLoop(t) { if (!lenis) return; lenis.raf(t); requestAnimationFrame(lenisLoop); }

const landing = {
  enter() {
    const canvas = document.querySelector(".planet-canvas");
    if (!reduced && !lenis) { lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.5 }); requestAnimationFrame(lenisLoop); }
    if (!canvas || !supportsWebGL()) return;
    canvas.hidden = false;
    if (!scene) { try { scene = buildScene(canvas); } catch (e) { canvas.hidden = true; return; } window.addEventListener("resize", onResize); }
    else resize(scene);
    active = true; scene.last = 0;
    if (!scene.raf) scene.raf = requestAnimationFrame(frame);
  },
  leave() {
    active = false;
    const canvas = document.querySelector(".planet-canvas"); if (canvas) canvas.hidden = true;
    if (lenis) { lenis.destroy(); lenis = null; }
  },
};
window.GW = window.GW || {};
window.GW.landing = landing;
if (document.body.classList.contains("on-landing")) landing.enter();
