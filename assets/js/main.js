        import * as THREE from 'three';

        // ═══════════════════════════════════════
        // FULL-PAGE 3D BACKGROUND SCENE
        // ═══════════════════════════════════════
        const bgCanvas = document.getElementById('bg-canvas');
        const bgScene = new THREE.Scene();
        const bgCam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        bgCam.position.set(0, 0, 30);

        // Background particles
        const bgParticleCount = 1500;
        const bgPositions = new Float32Array(bgParticleCount * 3);
        const bgColors = new Float32Array(bgParticleCount * 3);
        const cyanColor = new THREE.Color(0x00E5FF);
        const violetColor = new THREE.Color(0x8A2BE2);
        const whiteColor = new THREE.Color(0x334466);

        for (let i = 0; i < bgParticleCount; i++) {
            bgPositions[i * 3] = (Math.random() - 0.5) * 80;
            bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
            const r = Math.random();
            const color = r < 0.3 ? cyanColor : r < 0.6 ? violetColor : whiteColor;
            bgColors[i * 3] = color.r;
            bgColors[i * 3 + 1] = color.g;
            bgColors[i * 3 + 2] = color.b;
        }

        const bgParticleGeo = new THREE.BufferGeometry();
        bgParticleGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
        bgParticleGeo.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));
        const bgParticleMat = new THREE.PointsMaterial({ size: 0.12, transparent: true, opacity: 0.6, vertexColors: true, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
        const bgParticles = new THREE.Points(bgParticleGeo, bgParticleMat);
        bgScene.add(bgParticles);

        // Connection lines
        const linesMat = new THREE.LineBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.04, blending: THREE.AdditiveBlending, depthWrite: false });
        const linesGeo = new THREE.BufferGeometry();
        const maxLines = 600;
        const linePositions = new Float32Array(maxLines * 6);
        linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        linesGeo.setDrawRange(0, 0);
        const connectionLines = new THREE.LineSegments(linesGeo, linesMat);
        bgScene.add(connectionLines);

        // Floating shapes
        const shapes = [];
        const shapeMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, wireframe: true, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending });
        const shapeMatV = new THREE.MeshBasicMaterial({ color: 0x8A2BE2, wireframe: true, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending });

        for (let i = 0; i < 4; i++) {
            const geo = new THREE.IcosahedronGeometry(Math.random() * 3 + 1.5, 1);
            const mesh = new THREE.Mesh(geo, i % 2 === 0 ? shapeMat : shapeMatV);
            mesh.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 20 - 15);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            mesh.userData.rotSpeed = { x: (Math.random() - 0.5) * 0.003, y: (Math.random() - 0.5) * 0.003 };
            mesh.userData.floatOffset = Math.random() * Math.PI * 2;
            mesh.userData.floatSpeed = Math.random() * 0.3 + 0.2;
            bgScene.add(mesh);
            shapes.push(mesh);
        }

        for (let i = 0; i < 3; i++) {
            const geo = new THREE.TorusGeometry(Math.random() * 2 + 1, 0.1, 8, 24);
            const mesh = new THREE.Mesh(geo, i % 2 === 0 ? shapeMatV : shapeMat);
            mesh.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 20 - 15);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            mesh.userData.rotSpeed = { x: (Math.random() - 0.5) * 0.004, y: (Math.random() - 0.5) * 0.004 };
            mesh.userData.floatOffset = Math.random() * Math.PI * 2;
            mesh.userData.floatSpeed = Math.random() * 0.3 + 0.2;
            bgScene.add(mesh);
            shapes.push(mesh);
        }

        let bgMouseX = 0, bgMouseY = 0, bgTargetMouseX = 0, bgTargetMouseY = 0;
        document.addEventListener('mousemove', (e) => {
            bgTargetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            bgTargetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // ═══════════════════════════════════════
        // HERO 3D — HOLOGRAPHIC TECH SPHERE
        // ═══════════════════════════════════════
        const heroCanvas = document.getElementById('hero-canvas');
        const heroScene = new THREE.Scene();
        const heroCam = new THREE.PerspectiveCamera(50, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
        const heroRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
        heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
        heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        heroRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        heroRenderer.toneMappingExposure = 1.2;

        heroCam.position.set(0, 0, 10);
        heroCam.lookAt(0, 0, 0);

        // Lights
        heroScene.add(new THREE.AmbientLight(0x404060, 0.5));
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(8, 12, 6);
        heroScene.add(sunLight);
        const fillLight = new THREE.DirectionalLight(0x00E5FF, 0.5);
        fillLight.position.set(-5, 3, -5);
        heroScene.add(fillLight);
        const violetLight = new THREE.PointLight(0x8A2BE2, 1.5, 25);
        violetLight.position.set(3, 4, 2);
        heroScene.add(violetLight);
        const cyanLight = new THREE.PointLight(0x00E5FF, 1.0, 25);
        cyanLight.position.set(-3, -2, 4);
        heroScene.add(cyanLight);

        const techGroup = new THREE.Group();

        // Core sphere — glowing translucent
        const coreMat = new THREE.MeshPhysicalMaterial({
            color: 0x00E5FF,
            emissive: 0x00E5FF,
            emissiveIntensity: 0.4,
            transmission: 0.6,
            roughness: 0.1,
            metalness: 0.1,
            thickness: 1,
            transparent: true,
            opacity: 0.6,
        });
        const coreGeo = new THREE.IcosahedronGeometry(1.2, 2);
        const core = new THREE.Mesh(coreGeo, coreMat);
        techGroup.add(core);

        // Inner wireframe sphere
        const innerWireGeo = new THREE.IcosahedronGeometry(1.5, 1);
        const innerWireMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, wireframe: true, transparent: true, opacity: 0.2 });
        const innerWire = new THREE.Mesh(innerWireGeo, innerWireMat);
        techGroup.add(innerWire);

        // Outer wireframe sphere
        const outerWireGeo = new THREE.IcosahedronGeometry(2.5, 1);
        const outerWireMat = new THREE.MeshBasicMaterial({ color: 0x8A2BE2, wireframe: true, transparent: true, opacity: 0.08 });
        const outerWire = new THREE.Mesh(outerWireGeo, outerWireMat);
        techGroup.add(outerWire);

        // Orbiting rings
        const glowRingMat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, emissive: 0x00E5FF, emissiveIntensity: 1.2, roughness: 0.1, transparent: true, opacity: 0.8 });
        const violetRingMat = new THREE.MeshStandardMaterial({ color: 0x8A2BE2, emissive: 0x8A2BE2, emissiveIntensity: 0.8, roughness: 0.1, transparent: true, opacity: 0.6 });

        const ring1Geo = new THREE.TorusGeometry(2.2, 0.02, 8, 64);
        const ring1 = new THREE.Mesh(ring1Geo, glowRingMat);
        ring1.rotation.x = Math.PI / 3;
        ring1.rotation.y = 0.3;
        techGroup.add(ring1);

        const ring2Geo = new THREE.TorusGeometry(2.8, 0.015, 8, 64);
        const ring2 = new THREE.Mesh(ring2Geo, violetRingMat);
        ring2.rotation.x = -Math.PI / 4;
        ring2.rotation.z = 0.5;
        techGroup.add(ring2);

        const ring3Geo = new THREE.TorusGeometry(3.3, 0.01, 8, 64);
        const ring3 = new THREE.Mesh(ring3Geo, glowRingMat.clone());
        ring3.material.opacity = 0.4;
        ring3.rotation.x = Math.PI / 6;
        ring3.rotation.z = -0.8;
        techGroup.add(ring3);

        // Data nodes orbiting on rings
        const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, emissive: 0x00E5FF, emissiveIntensity: 2.0, roughness: 0.1 });
        const nodeMatV = new THREE.MeshStandardMaterial({ color: 0x8A2BE2, emissive: 0x8A2BE2, emissiveIntensity: 2.0, roughness: 0.1 });

        const orbitNodes = [];
        for (let i = 0; i < 8; i++) {
            const nodeGeo = new THREE.SphereGeometry(0.06 + Math.random() * 0.05, 8, 8);
            const node = new THREE.Mesh(nodeGeo, i % 2 === 0 ? nodeMat : nodeMatV);
            node.userData.orbitRadius = 2.2 + (i % 3) * 0.55;
            node.userData.orbitSpeed = 0.3 + Math.random() * 0.5;
            node.userData.orbitPhase = (i / 8) * Math.PI * 2;
            node.userData.orbitTilt = Math.PI / 3 + (i % 3) * 0.4 - 0.4;
            techGroup.add(node);
            orbitNodes.push(node);
        }

        // Floating tiny cubes (data blocks)
        const dataCubes = [];
        for (let i = 0; i < 12; i++) {
            const cubeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
            const cubeMat = new THREE.MeshStandardMaterial({
                color: i % 3 === 0 ? 0x00E5FF : i % 3 === 1 ? 0x8A2BE2 : 0x4466aa,
                emissive: i % 3 === 0 ? 0x00E5FF : i % 3 === 1 ? 0x8A2BE2 : 0x223355,
                emissiveIntensity: 0.8,
                roughness: 0.2,
                metalness: 0.6,
            });
            const cube = new THREE.Mesh(cubeGeo, cubeMat);
            cube.userData.floatRadius = 3 + Math.random() * 1.5;
            cube.userData.floatSpeed = 0.1 + Math.random() * 0.3;
            cube.userData.floatPhase = Math.random() * Math.PI * 2;
            cube.userData.floatY = (Math.random() - 0.5) * 3;
            techGroup.add(cube);
            dataCubes.push(cube);
        }

        // Hero floating particles
        const heroParticlesGeo = new THREE.BufferGeometry();
        const hpCount = 300;
        const hpPositions = new Float32Array(hpCount * 3);
        for (let i = 0; i < hpCount * 3; i += 3) {
            hpPositions[i] = (Math.random() - 0.5) * 16;
            hpPositions[i + 1] = (Math.random() - 0.5) * 12;
            hpPositions[i + 2] = (Math.random() - 0.5) * 16;
        }
        heroParticlesGeo.setAttribute('position', new THREE.BufferAttribute(hpPositions, 3));
        const heroParticleMat = new THREE.PointsMaterial({ color: 0x00E5FF, size: 0.04, transparent: true, opacity: 0.5, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
        const heroParticles = new THREE.Points(heroParticlesGeo, heroParticleMat);
        heroScene.add(heroParticles);

        techGroup.position.y = 0.3;
        heroScene.add(techGroup);

        // Build animation
        let buildProgress = 0;
        const allTechMeshes = [];
        techGroup.traverse(c => {
            if (c.isMesh) {
                allTechMeshes.push({ mesh: c, targetScale: c.scale.clone() });
                c.scale.set(0, 0, 0);
            }
        });

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // Service card mini scenes
        function createMiniScene(containerId, createContent) {
            const container = document.getElementById(containerId);
            if (!container) return null;
            const scene = new THREE.Scene();
            const cam = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);
            scene.add(new THREE.AmbientLight(0x8899bb, 0.8));
            const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
            dirLight.position.set(3, 4, 3);
            scene.add(dirLight);
            const content = createContent(scene);
            cam.position.set(0, 1.5, 4);
            cam.lookAt(0, 0.5, 0);
            return { scene, cam, renderer, content };
        }

        const mobileMini = createMiniScene('svc3d-mobile', (scene) => {
            const group = new THREE.Group();
            for (let i = 0; i < 2; i++) {
                const phoneGeo = new THREE.BoxGeometry(0.5, 0.9, 0.05);
                const phoneMat = new THREE.MeshStandardMaterial({ color: i === 0 ? 0x0B1E33 : 0x8A2BE2, roughness: 0.2, metalness: 0.7 });
                const phone = new THREE.Mesh(phoneGeo, phoneMat);
                phone.position.set(i * 1 - 0.5, 0.5, 0);
                phone.rotation.y = i * 0.3 - 0.15;
                const screenGeo = new THREE.PlaneGeometry(0.42, 0.78);
                const screenMat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, emissive: 0x00E5FF, emissiveIntensity: 0.3 });
                const screen = new THREE.Mesh(screenGeo, screenMat);
                screen.position.z = 0.03;
                phone.add(screen);
                group.add(phone);
            }
            scene.add(group);
            return group;
        });

        const webMini = createMiniScene('svc3d-web', (scene) => {
            const group = new THREE.Group();
            const globeGeo = new THREE.IcosahedronGeometry(0.7, 1);
            const globeMat = new THREE.MeshStandardMaterial({ color: 0x0B1E33, wireframe: true, roughness: 0.5 });
            const globe = new THREE.Mesh(globeGeo, globeMat);
            globe.position.y = 0.5;
            group.add(globe);
            const innerGeo = new THREE.SphereGeometry(0.5, 16, 16);
            const innerMat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, emissive: 0x00E5FF, emissiveIntensity: 0.3, transparent: true, opacity: 0.4 });
            const inner = new THREE.Mesh(innerGeo, innerMat);
            inner.position.y = 0.5;
            group.add(inner);
            scene.add(group);
            return group;
        });

        const marketMini = createMiniScene('svc3d-marketing', (scene) => {
            const group = new THREE.Group();
            const points = [];
            for (let i = 0; i < 8; i++) points.push(new THREE.Vector3(i * 0.2 - 0.7, Math.pow(i / 7, 1.5) * 1.2, 0));
            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.03, 8, false);
            const tubeMat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, emissive: 0x00E5FF, emissiveIntensity: 0.8 });
            group.add(new THREE.Mesh(tubeGeo, tubeMat));
            const arrowGeo = new THREE.ConeGeometry(0.1, 0.2, 6);
            const arrow = new THREE.Mesh(arrowGeo, tubeMat);
            arrow.position.set(0.7, 1.3, 0);
            arrow.rotation.z = -0.5;
            group.add(arrow);
            for (let i = 0; i < 5; i++) {
                const bGeo = new THREE.BoxGeometry(0.12, 0.3 + i * 0.15, 0.12);
                const bMat = new THREE.MeshStandardMaterial({ color: 0x0B1E33, transparent: true, opacity: 0.3 });
                const b = new THREE.Mesh(bGeo, bMat);
                b.position.set(-0.5 + i * 0.3, (0.3 + i * 0.15) / 2 - 0.2, -0.2);
                group.add(b);
            }
            scene.add(group);
            return group;
        });

        const staffMini = createMiniScene('svc3d-staff', (scene) => {
            const group = new THREE.Group();
            const colors = [0x0B1E33, 0x00E5FF, 0x8A2BE2, 0x1a3a5c];
            for (let i = 0; i < 4; i++) {
                const avatar = new THREE.Group();
                const headG = new THREE.SphereGeometry(0.15, 12, 12);
                const headM = new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.3, metalness: 0.4 });
                const h = new THREE.Mesh(headG, headM);
                h.position.y = 0.35;
                avatar.add(h);
                const bodyG = new THREE.CylinderGeometry(0.12, 0.16, 0.35, 8);
                const b = new THREE.Mesh(bodyG, headM);
                b.position.y = 0.08;
                avatar.add(b);
                const angle = (i / 4) * Math.PI * 2;
                avatar.position.set(Math.cos(angle) * 0.5, 0.4, Math.sin(angle) * 0.5);
                group.add(avatar);
            }
            const lineMat2 = new THREE.LineBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.4 });
            for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints([
                    group.children[i].position.clone().add(new THREE.Vector3(0, 0.2, 0)),
                    group.children[j].position.clone().add(new THREE.Vector3(0, 0.2, 0))
                ]);
                group.add(new THREE.Line(lineGeo, lineMat2));
            }
            scene.add(group);
            return group;
        });

        // ── Animation Loop ──
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // Background
            bgMouseX += (bgTargetMouseX - bgMouseX) * 0.03;
            bgMouseY += (bgTargetMouseY - bgMouseY) * 0.03;
            const scrollFactor = window.scrollY * 0.001;
            bgParticles.rotation.y = t * 0.015 + bgMouseX * 0.1;
            bgParticles.rotation.x = bgMouseY * 0.05 + scrollFactor * 0.3;

            const bgPosArr = bgParticleGeo.attributes.position.array;
            for (let i = 0; i < bgParticleCount * 3; i += 3) {
                bgPosArr[i + 1] += Math.sin(t * 0.2 + bgPosArr[i] * 0.1) * 0.002;
            }
            bgParticleGeo.attributes.position.needsUpdate = true;

            let lineIndex = 0;
            const linePosArr = linesGeo.attributes.position.array;
            const lineThreshold = 6;
            for (let i = 0; i < Math.min(bgParticleCount, 200) && lineIndex < maxLines; i++) {
                const x1 = bgPosArr[i * 3], y1 = bgPosArr[i * 3 + 1], z1 = bgPosArr[i * 3 + 2];
                for (let j = i + 1; j < Math.min(bgParticleCount, 200) && lineIndex < maxLines; j++) {
                    const dx = x1 - bgPosArr[j * 3], dy = y1 - bgPosArr[j * 3 + 1], dz = z1 - bgPosArr[j * 3 + 2];
                    if (dx * dx + dy * dy + dz * dz < lineThreshold * lineThreshold) {
                        linePosArr[lineIndex * 6] = x1; linePosArr[lineIndex * 6 + 1] = y1; linePosArr[lineIndex * 6 + 2] = z1;
                        linePosArr[lineIndex * 6 + 3] = bgPosArr[j * 3]; linePosArr[lineIndex * 6 + 4] = bgPosArr[j * 3 + 1]; linePosArr[lineIndex * 6 + 5] = bgPosArr[j * 3 + 2];
                        lineIndex++;
                    }
                }
            }
            linesGeo.setDrawRange(0, lineIndex * 2);
            linesGeo.attributes.position.needsUpdate = true;

            shapes.forEach(shape => {
                shape.rotation.x += shape.userData.rotSpeed.x;
                shape.rotation.y += shape.userData.rotSpeed.y;
                shape.position.y += Math.sin(t * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.003;
            });

            bgRenderer.render(bgScene, bgCam);

            // ── Hero Tech Sphere ──
            if (buildProgress < 1) {
                buildProgress += 0.012;
                const meshCount = allTechMeshes.length;
                allTechMeshes.forEach((item, i) => {
                    const threshold = i / meshCount;
                    if (buildProgress > threshold) {
                        const localP = Math.min(1, (buildProgress - threshold) * meshCount * 0.4);
                        const ease = 1 - Math.pow(1 - localP, 3);
                        item.mesh.scale.copy(item.targetScale).multiplyScalar(ease);
                    }
                });
            }

            // Rotate tech group
            techGroup.rotation.y = t * 0.15 + mouseX * 0.3;
            techGroup.rotation.x = mouseY * 0.1;
            techGroup.position.y = 0.3 + Math.sin(t * 0.6) * 0.2;

            // Counter-rotate wireframes
            innerWire.rotation.y = -t * 0.3;
            innerWire.rotation.x = t * 0.15;
            outerWire.rotation.y = t * 0.12;
            outerWire.rotation.z = t * 0.08;

            // Pulse core
            const corePulse = 1 + Math.sin(t * 2) * 0.05;
            core.scale.setScalar(corePulse);
            coreMat.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.2;

            // Orbit rings rotation
            ring1.rotation.z = t * 0.2;
            ring2.rotation.y = t * 0.15;
            ring3.rotation.x = Math.PI / 6 + t * 0.1;

            // Orbit nodes
            orbitNodes.forEach(node => {
                const angle = t * node.userData.orbitSpeed + node.userData.orbitPhase;
                const r = node.userData.orbitRadius;
                const tilt = node.userData.orbitTilt;
                node.position.x = Math.cos(angle) * r;
                node.position.y = Math.sin(angle) * Math.sin(tilt) * r * 0.4;
                node.position.z = Math.sin(angle) * Math.cos(tilt) * r;
            });

            // Data cubes float
            dataCubes.forEach(cube => {
                const angle = t * cube.userData.floatSpeed + cube.userData.floatPhase;
                const r = cube.userData.floatRadius;
                cube.position.x = Math.cos(angle) * r;
                cube.position.z = Math.sin(angle) * r;
                cube.position.y = cube.userData.floatY + Math.sin(t * 0.5 + cube.userData.floatPhase) * 0.3;
                cube.rotation.x = t * 0.5;
                cube.rotation.y = t * 0.7;
            });

            // Lights pulse
            violetLight.intensity = 1.5 + Math.sin(t * 2) * 0.5;
            cyanLight.intensity = 1.0 + Math.sin(t * 1.5 + 1) * 0.3;

            // Hero particles
            const hpPos = heroParticlesGeo.attributes.position.array;
            for (let i = 0; i < hpCount * 3; i += 3) {
                hpPos[i + 1] += 0.002;
                if (hpPos[i + 1] > 6) hpPos[i + 1] = -6;
            }
            heroParticlesGeo.attributes.position.needsUpdate = true;

            heroRenderer.render(heroScene, heroCam);

            // Mini scenes
            if (mobileMini) { mobileMini.content.rotation.y = t * 0.5; mobileMini.content.position.y = Math.sin(t) * 0.1; mobileMini.renderer.render(mobileMini.scene, mobileMini.cam); }
            if (webMini) { webMini.content.children[0].rotation.y = t * 0.8; webMini.content.children[0].rotation.x = t * 0.3; webMini.renderer.render(webMini.scene, webMini.cam); }
            if (marketMini) { marketMini.content.rotation.y = Math.sin(t * 0.5) * 0.2; marketMini.renderer.render(marketMini.scene, marketMini.cam); }
            if (staffMini) { staffMini.content.children.forEach((c, i) => { if (i < 4) c.position.y = 0.4 + Math.sin(t * 2 + i) * 0.05; }); staffMini.content.rotation.y = t * 0.3; staffMini.renderer.render(staffMini.scene, staffMini.cam); }
        }
        animate();

        // Resize
        window.addEventListener('resize', () => {
            bgCam.aspect = window.innerWidth / window.innerHeight;
            bgCam.updateProjectionMatrix();
            bgRenderer.setSize(window.innerWidth, window.innerHeight);
            heroCam.aspect = heroCanvas.clientWidth / heroCanvas.clientHeight;
            heroCam.updateProjectionMatrix();
            heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
        });

        // Scroll Reveal
        const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Counter Animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.counter').forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        let current = 0;
                        const increment = target / 60;
                        const timer = setInterval(() => { current += increment; if (current >= target) { counter.textContent = target; clearInterval(timer); } else counter.textContent = Math.floor(current); }, 25);
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        document.querySelectorAll('.stats-bar').forEach(el => counterObserver.observe(el));

        // Nav Scroll
        window.addEventListener('scroll', () => { document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 50); });

        // Scroll Progress
        window.addEventListener('scroll', () => {
            const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            document.getElementById('scrollProgress').style.width = progress + '%';
        });

        // Custom Cursor
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        document.addEventListener('mousemove', (e) => { dot.style.left = e.clientX - 4 + 'px'; dot.style.top = e.clientY - 4 + 'px'; ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; });
        document.querySelectorAll('a, button, .service-card, .team-card, .testimonial-card, .stat-card, .eco-logo, .process-step').forEach(el => {
            el.addEventListener('mouseenter', () => { ring.style.width = '56px'; ring.style.height = '56px'; ring.style.borderColor = 'rgba(0, 229, 255, 0.5)'; });
            el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'rgba(138, 43, 226, 0.6)'; });
        });

        // Shimmer effect
        const shimmerText = document.querySelector('.shimmer-text');
        if (shimmerText) { document.addEventListener('mousemove', (e) => { const rect = shimmerText.getBoundingClientRect(); shimmerText.style.backgroundPosition = `${((e.clientX - rect.left) / rect.width) * 100}% 0`; }); }

        // Tilt effect on cards
        document.querySelectorAll('.service-card, .testimonial-card').forEach(card => {
            card.addEventListener('mousemove', (e) => { const rect = card.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; card.style.transform = `translateY(-10px) perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`; });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
