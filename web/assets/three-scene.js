/* ============================================================
   Dashboard Mertani Web — adegan 3D (Three.js)
   File: assets/three-scene.js
   Model interaktif stasiun telemetri Sparing KIPI:
   tiang sensor, kotak perangkat, panel surya, antena dengan
   cincin sinyal berdenyut, dan tangki air yang ketinggiannya
   mengikuti pembacaan Water Level terakhir.
   API publik: window.MertaniThree.setLevels({waterLevel, battery, signal})
   Dimuat setelah three.min.js (CDN, build klasik / global THREE).
   ============================================================ */
(function () {
  "use strict";

  var state = { waterLevel: 1.84, battery: 86, signal: -67 };
  var api = {
    setLevels: function (levels) {
      if (!levels) return;
      if (typeof levels.waterLevel === "number") state.waterLevel = levels.waterLevel;
      if (typeof levels.battery === "number") state.battery = levels.battery;
      if (typeof levels.signal === "number") state.signal = levels.signal;
      if (scene3d) scene3d.applyLevels();
    }
  };
  window.MertaniThree = api;

  var scene3d = null;

  function showFallback() {
    var fb = document.getElementById("threeFallback");
    if (fb) fb.classList.add("show");
    var cv = document.getElementById("threeCanvas");
    if (cv) cv.style.display = "none";
  }

  function init() {
    var wrap = document.getElementById("threeWrap");
    var canvas = document.getElementById("threeCanvas");
    if (!wrap || !canvas) return;
    if (typeof THREE === "undefined") { showFallback(); return; }

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) { showFallback(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(6.4, 4.6, 7.6);

    /* ---------- cahaya ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var sun = new THREE.DirectionalLight(0xffffff, 1.05);
    sun.position.set(5, 9, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);
    var fill = new THREE.DirectionalLight(0xbfd6e4, 0.35);
    fill.position.set(-6, 4, -5);
    scene.add(fill);

    /* ---------- palet (selaras dashboard) ---------- */
    var MAT = {
      ground: new THREE.MeshStandardMaterial({ color: 0x9db2c1, roughness: 0.95 }),
      groundEdge: new THREE.MeshStandardMaterial({ color: 0x687e90, roughness: 0.9 }),
      pole: new THREE.MeshStandardMaterial({ color: 0x3d5265, roughness: 0.45, metalness: 0.55 }),
      box: new THREE.MeshStandardMaterial({ color: 0xe9551b, roughness: 0.5, metalness: 0.15 }),
      boxDark: new THREE.MeshStandardMaterial({ color: 0x15242f, roughness: 0.6 }),
      panel: new THREE.MeshStandardMaterial({ color: 0x1d4e79, roughness: 0.25, metalness: 0.6 }),
      panelFrame: new THREE.MeshStandardMaterial({ color: 0xcbd7df, roughness: 0.4, metalness: 0.7 }),
      tank: new THREE.MeshStandardMaterial({ color: 0xedf1f4, roughness: 0.35, metalness: 0.3, transparent: true, opacity: 0.55 }),
      water: new THREE.MeshStandardMaterial({ color: 0x1e8fe8, roughness: 0.15, transparent: true, opacity: 0.82 }),
      green: new THREE.MeshStandardMaterial({ color: 0x17a673, roughness: 0.4, emissive: 0x0d5c40, emissiveIntensity: 0.5 }),
      amber: new THREE.MeshStandardMaterial({ color: 0xd99a16, roughness: 0.4 }),
      white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
    };

    var station = new THREE.Group();
    scene.add(station);

    function box(w, h, d, mat, x, y, z) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true; m.receiveShadow = true;
      station.add(m);
      return m;
    }
    function cyl(rt, rb, h, mat, x, y, z, seg) {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 28), mat);
      m.position.set(x, y, z);
      m.castShadow = true; m.receiveShadow = true;
      station.add(m);
      return m;
    }

    /* ---------- tanah / landasan ---------- */
    var ground = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.7, 0.35, 48), MAT.ground);
    ground.position.y = -0.18;
    ground.receiveShadow = true;
    station.add(ground);
    var groundRing = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.045, 10, 64), MAT.groundEdge);
    groundRing.rotation.x = Math.PI / 2;
    groundRing.position.y = 0.0;
    station.add(groundRing);
    box(2.2, 0.18, 2.2, MAT.groundEdge, -1.1, 0.09, 0.2); // pelat beton tiang

    /* ---------- tiang + kotak perangkat ---------- */
    cyl(0.09, 0.11, 3.9, MAT.pole, -1.1, 2.1, 0.2);                    // tiang utama
    var deviceBox = box(0.95, 1.25, 0.42, MAT.box, -1.1, 2.45, 0.48); // kotak oranye
    box(0.7, 0.5, 0.03, MAT.boxDark, -1.1, 2.62, 0.71);               // layar
    var led = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), MAT.green.clone());
    led.position.set(-0.78, 3.18, 0.71);
    station.add(led);
    // bar baterai kecil di kotak (5 ruas, menyala sesuai level)
    var battBars = [];
    for (var b = 0; b < 5; b++) {
      var bar = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.2, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x17a673, roughness: 0.4, emissive: 0x17a673, emissiveIntensity: 0.35 }));
      bar.position.set(-1.32 + b * 0.15, 2.12, 0.71);
      station.add(bar);
      battBars.push(bar);
    }

    /* ---------- panel surya ---------- */
    var panelGroup = new THREE.Group();
    panelGroup.position.set(-1.1, 4.35, 0.2);
    panelGroup.rotation.x = -0.5;
    station.add(panelGroup);
    var panelFrame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.07, 1.25), MAT.panelFrame);
    panelFrame.castShadow = true;
    panelGroup.add(panelFrame);
    var panelFace = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.03, 1.11), MAT.panel);
    panelFace.position.y = 0.045;
    panelGroup.add(panelFace);
    for (var gx = -1; gx <= 1; gx++) {
      var gridLine = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.012, 1.11), MAT.panelFrame);
      gridLine.position.set(gx * 0.44, 0.065, 0);
      panelGroup.add(gridLine);
    }

    /* ---------- antena + cincin sinyal ---------- */
    cyl(0.035, 0.035, 1.5, MAT.pole, -0.35, 3.6, 0.2);
    var antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), MAT.green.clone());
    antennaTip.position.set(-0.35, 4.4, 0.2);
    station.add(antennaTip);
    var rings = [];
    for (var r = 0; r < 3; r++) {
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.022, 8, 40),
        new THREE.MeshBasicMaterial({ color: 0x17a673, transparent: true, opacity: 0.75 })
      );
      ring.position.copy(antennaTip.position);
      station.add(ring);
      rings.push(ring);
    }

    /* ---------- tangki air + level air ---------- */
    var tankX = 1.55, tankZ = 0.35, tankH = 2.9, tankR = 1.05;
    cyl(tankR + 0.12, tankR + 0.2, 0.16, MAT.groundEdge, tankX, 0.08, tankZ); // alas tangki
    var tank = cyl(tankR, tankR, tankH, MAT.tank, tankX, 0.16 + tankH / 2, tankZ, 36);
    tank.castShadow = false;
    var tankLid = cyl(tankR + 0.06, tankR + 0.06, 0.1, MAT.box, tankX, 0.16 + tankH + 0.05, tankZ, 36);
    tankLid.castShadow = true;
    var water = new THREE.Mesh(
      new THREE.CylinderGeometry(tankR - 0.07, tankR - 0.07, 1, 32),
      MAT.water
    );
    water.position.set(tankX, 0.16, tankZ);
    station.add(water);
    // pipa dari tangki ke kotak sensor
    var pipe = cyl(0.05, 0.05, 2.5, MAT.pole, 0.25, 0.55, 0.32);
    pipe.rotation.z = Math.PI / 2;

    /* ---------- titik sensor melayang (data) ---------- */
    var dots = [];
    var dotGeo = new THREE.SphereGeometry(0.06, 10, 10);
    for (var dI = 0; dI < 14; dI++) {
      var dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({
        color: dI % 3 === 0 ? 0xe9551b : 0x1e8fe8, transparent: true, opacity: 0.85
      }));
      var ang = (dI / 14) * Math.PI * 2;
      dot.position.set(Math.cos(ang) * (2.2 + (dI % 3) * 0.5), 1 + (dI % 5) * 0.55, Math.sin(ang) * (2.2 + (dI % 3) * 0.5));
      dot.userData = { ang: ang, rad: 2.2 + (dI % 3) * 0.5, baseY: dot.position.y, speed: 0.25 + (dI % 4) * 0.08 };
      station.add(dot);
      dots.push(dot);
    }

    function applyLevels() {
      // Water Level: skala 0–2,5 m -> tinggi air di tangki (maks 2,5 m isi penuh)
      var frac = Math.max(0.04, Math.min(1, state.waterLevel / 2.5));
      var h = frac * (tankH - 0.25);
      water.scale.y = h;
      water.position.y = 0.16 + h / 2;
      // Baterai: jumlah ruas menyala dari 5
      var lit = Math.round((state.battery / 100) * battBars.length);
      battBars.forEach(function (barEl, i) {
        barEl.material.emissiveIntensity = i < lit ? 0.55 : 0;
        barEl.material.color.setHex(i < lit ? 0x17a673 : 0x3d5265);
      });
      // Sinyal: makin kuat (dekat -50) cincin makin besar & terang
      var strength = Math.max(0.25, Math.min(1, (state.signal + 100) / 50));
      rings.forEach(function (ringEl) {
        ringEl.material.color.setHex(strength > 0.55 ? 0x17a673 : 0xd99a16);
      });
      antennaTip.material.color.setHex(strength > 0.55 ? 0x17a673 : 0xd99a16);
    }
    applyLevels();

    /* ---------- interaksi: seret untuk memutar ---------- */
    var targetRotY = 0.6, rotY = 0.6, targetRotX = 0.12, rotX = 0.12;
    var dragging = false, lastX = 0, lastY = 0, autoSpin = true;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    canvas.addEventListener("pointerdown", function (e) {
      dragging = true; autoSpin = false;
      lastX = e.clientX; lastY = e.clientY;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      targetRotY += (e.clientX - lastX) * 0.008;
      targetRotX += (e.clientY - lastY) * 0.005;
      targetRotX = Math.max(-0.15, Math.min(0.55, targetRotX));
      lastX = e.clientX; lastY = e.clientY;
    });
    function endDrag() { dragging = false; }
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    /* ---------- ukuran responsif ---------- */
    function resize() {
      var w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(wrap);
    window.addEventListener("resize", resize);

    /* ---------- loop animasi ---------- */
    var clock = new THREE.Clock();
    function tick() {
      requestAnimationFrame(tick);
      var t = clock.getElapsedTime();
      if (autoSpin && !reduceMotion) targetRotY += 0.0022;
      rotY += (targetRotY - rotY) * 0.07;
      rotX += (targetRotX - rotX) * 0.07;
      station.rotation.y = rotY;
      station.rotation.x = rotX * 0.35;
      station.position.y = reduceMotion ? 0 : Math.sin(t * 0.7) * 0.03;

      // cincin sinyal: mengembang & memudar bergantian
      var strength = Math.max(0.25, Math.min(1, (state.signal + 100) / 50));
      rings.forEach(function (ringEl, i) {
        var phase = ((t * (0.35 + strength * 0.4)) + i / rings.length) % 1;
        var s = 0.4 + phase * (1.1 + strength * 0.9);
        ringEl.scale.set(s, s, s);
        ringEl.material.opacity = (1 - phase) * 0.8;
        ringEl.lookAt(camera.position);
      });
      // LED berkedip halus
      led.material.emissiveIntensity = 0.4 + Math.abs(Math.sin(t * 2.2)) * 0.7;
      // titik data mengorbit pelan
      if (!reduceMotion) {
        dots.forEach(function (dot) {
          dot.userData.ang += dot.userData.speed * 0.004;
          dot.position.x = Math.cos(dot.userData.ang) * dot.userData.rad;
          dot.position.z = Math.sin(dot.userData.ang) * dot.userData.rad;
          dot.position.y = dot.userData.baseY + Math.sin(t * 0.9 + dot.userData.rad) * 0.08;
        });
      }
      // permukaan air bergelombang halus (skala napas)
      water.rotation.y = t * 0.15;
      camera.lookAt(0, 1.9, 0);
      renderer.render(scene, camera);
    }
    tick();

    scene3d = { applyLevels: applyLevels };
    api.setLevels(state);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
