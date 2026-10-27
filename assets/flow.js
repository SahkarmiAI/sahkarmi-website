/* The flow of AI spend, in WebGL behind the note. Every point is a charge travelling from where it was
   billed, through Hisaab, to the team that spent it. Ember points are waste. After you approve the fix,
   each support charge that reaches Hisaab turns mint and pools as savings instead of leaking away.
   Listens for 'spot', 'approved' and 'theme' from main.js. */
import * as THREE from 'three';

const stage = document.querySelector('.stage'), cv = document.getElementById('flow');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches, phone = () => innerWidth <= 720;
const touch = !matchMedia('(pointer: fine)').matches; // no mouse to tilt the scene, so it turns on its own
// Bloom only on larger screens: phones skip ten module downloads and most of the GPU work
const post = phone() ? null : await Promise.all(['EffectComposer', 'RenderPass', 'UnrealBloomPass', 'OutputPass']
  .map(n => import(`three/addons/postprocessing/${n}.js`))).catch(() => null);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// World layout (y is up). [label, position, share of spend]
const SRC = [['OpenAI', V(-2.4, .95, -.4), .4], ['Anthropic', V(-2.4, .32, -.1), .32], ['Cloud', V(-2.4, -.32, .2), .16], ['Cards', V(-2.4, -.95, .5), .12]];
const TEAM = [['Support', V(1.8, .85, .3), .44], ['Sales', V(1.8, 0, 0), .32], ['Ops', V(1.8, -.85, -.3), .24]];
const HUB = V(-.55, 0, 0), LEAK = V(3.6, 2.5, -1.4), POOL = V(.75, -1.75, .7);

// Each route is a smooth curve sampled once into a table of points and a frame for the spiral offset
const route = (a, b, c1, c2) => {
  const curve = new THREE.CubicBezierCurve3(a, c1 || a.clone().add(V(1, 0, 0)), c2 || b.clone().add(V(-1, 0, 0)), b), n = 160;
  const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), bin = new Float32Array(n * 3), up = V(0, 1, 0);
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), p = curve.getPoint(t), T = curve.getTangent(t), N = new THREE.Vector3().crossVectors(T, up).normalize(), B = new THREE.Vector3().crossVectors(T, N);
    p.toArray(pos, i * 3); N.toArray(nrm, i * 3); B.toArray(bin, i * 3);
  }
  return { curve, pos, nrm, bin, n };
};
const IN = SRC.map(s => route(s[1], HUB)), OUT = TEAM.map(t => route(HUB, t[1]));
const LEAKR = route(HUB, LEAK, V(.4, .5, 0), V(2.4, 1.2, -.6)), POOLR = route(HUB, POOL, V(.4, -.4, 0), V(.4, -1.2, .6));
const pick = list => { let r = Math.random(); return Math.max(0, list.findIndex(n => (r -= n[2]) <= 0)); };

function start() {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' }); }
  catch { stage.hidden = true; return; }

  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, .1, 60), world = new THREE.Group();
  camera.position.set(0, 0, 7.5); scene.add(world);
  let composer, bloom;
  if (post) {
    const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = post;
    composer = new EffectComposer(renderer); bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .55, .35, .05);
    composer.addPass(new RenderPass(scene, camera)); composer.addPass(bloom); composer.addPass(new OutputPass());
  }

  // Particles: positions computed on the CPU from the route tables; a soft round glow in the shader
  const N = phone() ? 1200 : 2400;
  const pts = Array.from({ length: N }, () => {
    const s = pick(SRC), t = pick(TEAM), r = Math.random();
    const kind = t === 0 && r < .3 ? 'support' : s === 3 && r < .45 ? 'seats' : t > 0 && r < .07 ? 'tools' : '';
    return { s, t, kind, out: kind === 'support' ? LEAKR : OUT[t], u: Math.random(), v: (.00004 + Math.random() * .00005) * (phone() ? 1.6 : 1), a0: Math.random() * 6.283, tw: (Math.random() - .5) * 7, rad: Math.sqrt(Math.random()), al: 0, c: -1 };
  });
  const geo = new THREE.BufferGeometry();
  const P = new Float32Array(N * 3), C = new Float32Array(N * 3), A = new Float32Array(N), S = Float32Array.from(pts, () => .7 + Math.random() * 1.1);
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('aColor', new THREE.BufferAttribute(C, 3));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(A, 1)); geo.setAttribute('aSize', new THREE.BufferAttribute(S, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uScale: { value: 1 }, uBoost: { value: 1 } }, transparent: true, depthWrite: false,
    vertexShader: `attribute vec3 aColor; attribute float aAlpha, aSize; uniform float uScale, uBoost; varying vec3 vC; varying float vA;
      void main() { vC = aColor; vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.); gl_PointSize = aSize * uBoost * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying vec3 vC; varying float vA;
      void main() { float d = length(gl_PointCoord - .5), a = smoothstep(.5, .0, d); gl_FragColor = vec4(vC, a * a * vA);
      #include <colorspace_fragment>
      }`
  });
  const points = new THREE.Points(geo, mat); points.frustumCulled = false; world.add(points);

  // Nodes, faint guide lines, the Hisaab rings and the savings pool
  const basic = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  const nodeMat = basic(0xffffff), hubMat = basic(0xffffff), poolMat = basic(0xffffff, 0), lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: .12 });
  const leakLine = new THREE.LineBasicMaterial({ transparent: true, opacity: .14 }), poolLine = new THREE.LineBasicMaterial({ transparent: true, opacity: 0 });
  const dot = new THREE.SphereGeometry(.045, 20, 12);
  [...SRC, ...TEAM].forEach(([, p]) => { const m = new THREE.Mesh(dot, nodeMat); m.position.copy(p); world.add(m); });
  [...IN, ...OUT].forEach(r => world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(r.curve.getPoints(80)), lineMat)));
  world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(LEAKR.curve.getPoints(80)), leakLine));
  world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(POOLR.curve.getPoints(80)), poolLine));
  const hub = new THREE.Group(); hub.position.copy(HUB); world.add(hub);
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(.36, .007, 12, 180), hubMat), ringB = ringA.clone(), arc = new THREE.Mesh(new THREE.TorusGeometry(.46, .005, 8, 90, 1.4), hubMat);
  ringA.rotation.y = 1.3; ringB.rotation.set(.5, 1.1, 0); hub.add(ringA, ringB, arc);
  const pool = new THREE.Mesh(new THREE.TorusGeometry(.3, .008, 12, 160), poolMat); pool.position.copy(POOL); pool.rotation.x = 1.3; world.add(pool);

  // HTML labels that follow their 3D points (crisp text, theme aware)
  const tag = (text, at, cls = '') => { const el = document.createElement('span'); el.className = `lbl ${cls}`; el.textContent = text; stage.append(el); return { el, at }; };
  const labels = [...SRC.map(([n, p]) => tag(n, p)), ...TEAM.map(([n, p]) => tag(n, p, 'r')), tag('Hisaab', HUB.clone().add(V(0, -.5, 0)), 'hub'),
    tag('Wasted: $6,400 a month', LEAKR.curve.getPoint(.62), 'waste'), tag('Saved: $6,400 a month', POOL.clone().add(V(0, -.42, 0)), 'saved')];

  let baseY = 0, col, dark, focus = null, saved = false, savedK = 0, mx = 0, my = 0, rx = 0, ry = 0, scroll = 0, W = 1, H = 1, last = 0;
  const RGB = [new THREE.Color(), new THREE.Color(), new THREE.Color()];
  const paint = () => {
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    dark = document.documentElement.dataset.theme !== 'light';
    col = { bg: css('--bg'), blue: css('--blue'), ember: css('--ember'), mint: css('--mint'), quiet: css('--quiet') };
    scene.background = new THREE.Color(col.bg);
    [col.blue, col.ember, col.mint].forEach((c, i) => RGB[i].set(c));
    nodeMat.color.set(col.quiet); hubMat.color.set(col.blue); poolMat.color.set(col.mint);
    lineMat.color.set(col.blue); leakLine.color.set(col.ember); poolLine.color.set(col.mint);
    mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending; mat.needsUpdate = true;
    if (bloom) bloom.enabled = dark;
    mat.uniforms.uBoost.value = dark ? (bloom ? 1 : 1.25) : (bloom ? 2.2 : 1.6); pts.forEach(p => p.c = -1);
  };
  const size = () => {
    W = stage.clientWidth; H = stage.clientHeight;
    const pr = Math.min(devicePixelRatio || 1, phone() ? 1.5 : 2);
    renderer.setPixelRatio(pr); renderer.setSize(W, H, false); composer?.setPixelRatio(pr); composer?.setSize(W, H);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    // Fit the scene between two screen fractions: right of the headline on wide screens, above it on phones
    const halfH = Math.tan(THREE.MathUtils.degToRad(19)) * 7.5, halfW = halfH * camera.aspect, hero = document.querySelector('.hero').getBoundingClientRect();
    const [L, R, Y] = phone() ? [.12, .76, .6] : [Math.max(.5, (hero.right + 32) / W), .87, 0];
    const left = (2 * L - 1) * halfW, s = Math.min(1, ((2 * R - 1) * halfW - left) / 4.2);
    world.scale.setScalar(s); world.position.set(left + 2.4 * s, Y * halfH, 0); baseY = Y * halfH;
    mat.uniforms.uScale.value = H * pr * .05 * Math.max(.55, s); // smaller scene, smaller points
  };

  const tmp = new THREE.Vector3();
  const at = (r, k, p, o) => { // point on a route with a spiral offset around it
    const i = Math.min(r.n - 2, Math.floor(k * (r.n - 1))), f = k * (r.n - 1) - i, j = i * 3;
    const th = p.a0 + k * p.tw, rad = p.rad * (.11 + .12 * Math.sin(Math.PI * k)), cs = Math.cos(th) * rad, sn = Math.sin(th) * rad;
    for (let d = 0; d < 3; d++) P[o + d] = r.pos[j + d] + (r.pos[j + 3 + d] - r.pos[j + d]) * f + r.nrm[j + d] * cs + r.bin[j + d] * sn;
  };
  const lit = p => !focus || (focus === 'support' ? p.t === 0 : focus === 'seats' ? p.s === 3 : p.kind === 'tools');

  function frame(now) {
    const dt = Math.min(now - last || 16, 50); last = now;
    savedK += ((saved ? 1 : 0) - savedK) * (still ? 1 : .03);
    pts.forEach((p, i) => {
      const before = p.u;
      if (!still) p.u = (p.u + p.v * dt) % 1;
      if (p.kind === 'support' && before < .5 && p.u >= .5) p.out = saved ? POOLR : LEAKR; // decided as it passes Hisaab
      const first = p.u < .5, k = first ? p.u * 2 : p.u * 2 - 1;
      at(first ? IN[p.s] : p.out, k, p, i * 3);
      const ends = p.out === LEAKR && !first ? 1 - k : 1;
      A[i] = p.al += ((lit(p) ? (dark && bloom ? .75 : .95) : .07) * ends - p.al) * .08;
      const c = p.kind === 'support' ? (p.out === POOLR && !first ? 2 : 1) : p.kind ? 1 : 0;
      if (c !== p.c) { p.c = c; RGB[c].toArray(C, i * 3); geo.attributes.aColor.needsUpdate = true; }
    });
    geo.attributes.position.needsUpdate = geo.attributes.aAlpha.needsUpdate = true;

    rx += (my * .12 - rx) * .05; ry += (mx * .3 - ry) * .05;
    const sway = touch && !still ? [Math.sin(now / 3300) * .12, Math.sin(now / 2400) * .45] : [0, Math.sin(now / 9000) * .06];
    world.rotation.set(rx + sway[0], ry + sway[1] - scroll * .25, 0);
    world.position.y = baseY + scroll * .6 * world.scale.x; camera.position.z = 7.5 - scroll * .8;
    ringA.rotation.z = now / 2600; ringB.rotation.z = -now / 3400; arc.rotation.z = now / 700;
    poolMat.opacity = savedK; poolLine.opacity = savedK * .14; leakLine.opacity = (1 - savedK) * .14;
    pool.scale.setScalar(1 + savedK * .15 + Math.sin(now / 500) * .02 * savedK);
    composer ? composer.render() : renderer.render(scene, camera);

    labels.forEach(({ el, at: w }) => {
      tmp.copy(w).applyMatrix4(world.matrixWorld).project(camera);
      el.style.transform = `translate(${(tmp.x + 1) / 2 * W}px, ${(1 - tmp.y) / 2 * H}px)`;
    });
    labels.at(-2).el.style.opacity = 1 - savedK; labels.at(-1).el.style.opacity = savedK;
  }

  let running = false, inView = true;
  const run = () => { const on = inView && !document.hidden && !still; if (on !== running) { running = on; renderer.setAnimationLoop(on ? frame : null); } };
  const draw = () => { if (!running) frame(performance.now()); };

  paint(); size(); draw(); run();
  new ResizeObserver(() => { size(); draw(); }).observe(stage);
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; run(); }).observe(stage.parentElement);
  document.addEventListener('visibilitychange', run);
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; } });
  document.addEventListener('spot', e => { focus = e.detail; draw(); });
  document.addEventListener('approved', e => { saved = e.detail; if (still) pts.forEach(p => { if (p.kind === 'support') p.out = saved ? POOLR : LEAKR; }); draw(); });
  document.addEventListener('theme', () => { paint(); draw(); });
  // As you read the note, the camera moves in and turns toward the support stream
  if (window.ScrollTrigger && !still) ScrollTrigger.create({ trigger: '#hisaab', start: 'top top', end: 'bottom bottom', scrub: 1, onUpdate: s => { scroll = s.progress; } });
}
start();
