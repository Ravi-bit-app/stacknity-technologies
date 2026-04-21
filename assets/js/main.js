import * as THREE from 'three';

/**
 * Stacknity Premium 3D Engine
 * Author: Stacknity Group
 * Description: High-performance holographic tech sphere and background particle field.
 */

class TechScene {
    constructor() {
        this.heroContainer = document.getElementById('hero-canvas');
        this.bgContainer = document.getElementById('bg-canvas');
        this.formContainer = document.getElementById('form-3d-canvas');
        
        if (this.bgContainer) {
            try { this.initBackground(); } catch(e) { console.error("BG Init Failed", e); }
        }
        
        if (this.heroContainer) {
            try { this.initHero(); } catch(e) { console.error("Hero Init Failed", e); }
        }

        if (this.formContainer) {
            try { this.initFormAsset(); } catch(e) { console.error("Form Asset Init Failed", e); }
        }

        this.addEventListeners();
        this.animate();
    }

    initBackground() {
        this.bgScene = new THREE.Scene();
        this.bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.bgRenderer = new THREE.WebGLRenderer({
            canvas: this.bgContainer,
            alpha: true,
            antialias: true
        });

        this.bgRenderer.setSize(window.innerWidth, window.innerHeight);
        this.bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particle Field
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 2500;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 15;
            colors[i] = Math.random();
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.015,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.4,
            vertexColors: false,
            color: 0x00E5FF
        });

        this.stars = new THREE.Points(particlesGeometry, particlesMaterial);
        this.bgScene.add(this.stars);
        this.bgCamera.position.z = 5;
    }

    initHero() {
        this.heroScene = new THREE.Scene();
        this.heroCamera = new THREE.PerspectiveCamera(45, this.heroContainer.clientWidth / this.heroContainer.clientHeight, 0.1, 1000);
        this.heroRenderer = new THREE.WebGLRenderer({
            canvas: this.heroContainer,
            alpha: true,
            antialias: true
        });

        this.heroRenderer.setSize(this.heroContainer.clientWidth, this.heroContainer.clientHeight);
        this.heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Groups for complex rotation
        this.coreGroup = new THREE.Group();
        this.ringsGroup = new THREE.Group();
        this.nodesGroup = new THREE.Group();
        this.heroScene.add(this.coreGroup);
        this.heroScene.add(this.ringsGroup);
        this.heroScene.add(this.nodesGroup);

        // 1. Core Holographic Sphere (Torus Knot)
        const torusGeometry = new THREE.TorusKnotGeometry(1.2, 0.4, 250, 48);
        this.torusMaterial = new THREE.MeshStandardMaterial({
            color: 0x00E5FF,
            emissive: 0x8A2BE2,
            emissiveIntensity: 0.8,
            wireframe: true,
            transparent: true,
            opacity: 0.7,
            metalness: 0.9,
            roughness: 0.1
        });
        this.torus = new THREE.Mesh(torusGeometry, this.torusMaterial);
        this.coreGroup.add(this.torus);

        // 2. Inner Glow Sphere
        const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: 0x8A2BE2,
            transparent: true,
            opacity: 0.15
        });
        this.innerSphere = new THREE.Mesh(sphereGeo, sphereMat);
        this.coreGroup.add(this.innerSphere);

        // 3. Orbiting Data Rings
        const ringConfigs = [
            { r: 2.2, color: 0x00E5FF, speed: 0.01, axis: 'x' },
            { r: 2.5, color: 0x8A2BE2, speed: -0.015, axis: 'y' },
            { r: 2.8, color: 0x00E5FF, speed: 0.008, axis: 'z' }
        ];

        this.rings = [];
        ringConfigs.forEach(config => {
            const geometry = new THREE.RingGeometry(config.r, config.r + 0.03, 128);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.4
            });
            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            this.ringsGroup.add(ring);
            this.rings.push({ mesh: ring, config });
        });

        // 4. Data Nodes (Small Floating Cubes)
        for (let i = 0; i < 15; i++) {
            const nodeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
            const nodeMat = new THREE.MeshStandardMaterial({
                color: 0x00E5FF,
                emissive: 0x00E5FF,
                emissiveIntensity: 1
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            const dist = 3 + Math.random() * 2;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            
            node.position.set(
                dist * Math.sin(theta) * Math.cos(phi),
                dist * Math.sin(theta) * Math.sin(phi),
                dist * Math.cos(theta)
            );
            node.userData = {
                phi, theta, dist,
                speed: 0.005 + Math.random() * 0.01
            };
            this.nodesGroup.add(node);
        }

        // Lighting
        const mainLight = new THREE.PointLight(0x00E5FF, 2, 50);
        mainLight.position.set(5, 5, 5);
        this.heroScene.add(mainLight);

        const accentLight = new THREE.PointLight(0x8A2BE2, 3, 50);
        accentLight.position.set(-5, -5, 5);
        this.heroScene.add(accentLight);

        this.heroScene.add(new THREE.AmbientLight(0xffffff, 0.3));

        this.heroCamera.position.z = 8;
        
        // Interaction targets
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
    }

    initFormAsset() {
        this.formScene = new THREE.Scene();
        this.formCamera = new THREE.PerspectiveCamera(45, this.formContainer.clientWidth / this.formContainer.clientHeight, 0.1, 1000);
        this.formRenderer = new THREE.WebGLRenderer({
            canvas: this.formContainer,
            alpha: true,
            antialias: true
        });

        this.formRenderer.setSize(this.formContainer.clientWidth, this.formContainer.clientHeight);
        this.formRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Geometric Data Crystal
        const crystalGeo = new THREE.IcosahedronGeometry(2, 0);
        const crystalMat = new THREE.MeshStandardMaterial({
            color: 0x00E5FF,
            wireframe: true,
            transparent: true,
            opacity: 0.8,
            emissive: 0x8A2BE2,
            emissiveIntensity: 0.5
        });
        
        this.crystal = new THREE.Mesh(crystalGeo, crystalMat);
        this.formScene.add(this.crystal);

        // Core points
        const pointsGeo = new THREE.IcosahedronGeometry(1.9, 1);
        const pointsMat = new THREE.PointsMaterial({
            color: 0x00E5FF,
            size: 0.05
        });
        this.crystalPoints = new THREE.Points(pointsGeo, pointsMat);
        this.formScene.add(this.crystalPoints);

        // Lighting
        const light = new THREE.PointLight(0x00E5FF, 5, 20);
        light.position.set(5, 5, 5);
        this.formScene.add(light);
        this.formScene.add(new THREE.AmbientLight(0xffffff, 0.5));

        this.formCamera.position.z = 6;
    }

    addEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) - 0.5;
            this.mouseY = (e.clientY / window.innerHeight) - 0.5;
        });

        window.addEventListener('resize', () => {
            // Resize BG
            this.bgCamera.aspect = window.innerWidth / window.innerHeight;
            this.bgCamera.updateProjectionMatrix();
            this.bgRenderer.setSize(window.innerWidth, window.innerHeight);

            // Resize Hero
            if (this.heroContainer) {
                this.heroCamera.aspect = this.heroContainer.clientWidth / this.heroContainer.clientHeight;
                this.heroCamera.updateProjectionMatrix();
                this.heroRenderer.setSize(this.heroContainer.clientWidth, this.heroContainer.clientHeight);
            }

            // Resize Form Asset
            if (this.formContainer) {
                this.formCamera.aspect = this.formContainer.clientWidth / this.formContainer.clientHeight;
                this.formCamera.updateProjectionMatrix();
                this.formRenderer.setSize(this.formContainer.clientWidth, this.formContainer.clientHeight);
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Animate BG Stars
        if (this.stars) {
            this.stars.rotation.y += 0.0005;
            this.stars.rotation.x += 0.0002;
        }

        // Animate Hero Core
        if (this.coreGroup) {
            // Base rotation
            this.coreGroup.rotation.y += 0.005;
            this.coreGroup.rotation.z += 0.002;

            // Mouse parallax
            this.targetRotationX = this.mouseY * 0.5;
            this.targetRotationY = this.mouseX * 0.5;
            
            this.coreGroup.rotation.x += 0.05 * (this.targetRotationX - this.coreGroup.rotation.x);
            this.coreGroup.rotation.y += 0.05 * (this.targetRotationY - this.coreGroup.rotation.y);

            // Shimmer effect on material
            this.torusMaterial.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
        }

        // Animate Rings
        this.rings.forEach(r => {
            if (r.config.axis === 'x') r.mesh.rotation.x += r.config.speed;
            if (r.config.axis === 'y') r.mesh.rotation.y += r.config.speed;
            if (r.config.axis === 'z') r.mesh.rotation.z += r.config.speed;
        });

        // Animate Nodes
        this.nodesGroup.children.forEach(node => {
            node.userData.phi += node.userData.speed;
            const d = node.userData.dist;
            node.position.x = d * Math.sin(node.userData.theta) * Math.cos(node.userData.phi);
            node.position.z = d * Math.sin(node.userData.theta) * Math.sin(node.userData.phi);
            node.rotation.x += 0.02;
            node.rotation.y += 0.02;
        });

        this.bgRenderer.render(this.bgScene, this.bgCamera);
        if (this.heroRenderer) this.heroRenderer.render(this.heroScene, this.heroCamera);

        // Animate Form Asset
        if (this.formRenderer && this.crystal) {
            this.crystal.rotation.y += 0.01;
            this.crystal.rotation.x += 0.005;
            this.crystalPoints.rotation.y -= 0.005;

            // Parallax
            this.crystal.position.x += (this.mouseX * 2 - this.crystal.position.x) * 0.1;
            this.crystal.position.y += (-this.mouseY * 2 - this.crystal.position.y) * 0.1;

            this.formRenderer.render(this.formScene, this.formCamera);
        }
    }
}

// Architect Carousel & 3D Asset Engine
class ArchitectCarousel {
    constructor() {
        this.track = document.getElementById('architectTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.canvases = document.querySelectorAll('.architect-canvas');
        
        if (!this.track) return;

        this.initNavigation();
        this.init3DScenes();
    }

    initNavigation() {
        const scrollAmount = 360; // Card width + gap
        this.nextBtn?.addEventListener('click', () => {
            this.track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        this.prevBtn?.addEventListener('click', () => {
            this.track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Mouse Drag Interaction
        let isDown = false;
        let startX;
        let scrollLeft;

        this.track.addEventListener('mousedown', (e) => {
            isDown = true;
            this.track.classList.add('active');
            startX = e.pageX - this.track.offsetLeft;
            scrollLeft = this.track.scrollLeft;
        });
        this.track.addEventListener('mouseleave', () => {
            isDown = false;
        });
        this.track.addEventListener('mouseup', () => {
            isDown = false;
        });
        this.track.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - this.track.offsetLeft;
            const walk = (x - startX) * 2;
            this.track.scrollLeft = scrollLeft - walk;
        });
    }

    init3DScenes() {
        this.scenes = [];
        const config = {
            core: (scene) => {
                const geo = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
                const mat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, wireframe: true, emissive: 0x00E5FF, emissiveIntensity: 0.5 });
                const mesh = new THREE.Mesh(geo, mat);
                scene.add(mesh);
                return mesh;
            },
            mesh: (scene) => {
                const geo = new THREE.IcosahedronGeometry(1.5, 1);
                const mat = new THREE.MeshStandardMaterial({ color: 0x8A2BE2, wireframe: true, emissive: 0x8A2BE2, emissiveIntensity: 0.5 });
                const mesh = new THREE.Mesh(geo, mat);
                scene.add(mesh);
                return mesh;
            },
            prism: (scene) => {
                const geo = new THREE.OctahedronGeometry(1.5, 0);
                const mat = new THREE.MeshStandardMaterial({ color: 0xFF0080, wireframe: true, emissive: 0xFF0080, emissiveIntensity: 0.5 });
                const mesh = new THREE.Mesh(geo, mat);
                scene.add(mesh);
                return mesh;
            },
            nodes: (scene) => {
                const geo = new THREE.SphereGeometry(1.3, 8, 8);
                const mat = new THREE.PointsMaterial({ color: 0x00E5FF, size: 0.05 });
                const mesh = new THREE.Points(geo, mat);
                scene.add(mesh);
                return mesh;
            },
            ring: (scene) => {
                const geo = new THREE.TorusGeometry(1.4, 0.05, 16, 100);
                const mat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.6 });
                const mesh = new THREE.Mesh(geo, mat);
                scene.add(mesh);
                return mesh;
            }
        };

        this.canvases.forEach(canvas => {
            const type = canvas.getAttribute('data-asset') || 'core';
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const light = new THREE.PointLight(0xffffff, 5, 10);
            light.position.set(2, 2, 5);
            scene.add(light);
            scene.add(new THREE.AmbientLight(0xffffff, 0.5));

            const mesh = config[type](scene);
            this.scenes.push({ renderer, scene, camera, mesh, canvas });
        });

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.scenes.forEach(s => {
            // Only render if card is visible could be optimized with IntersectionObserver
            s.mesh.rotation.y += 0.01;
            s.mesh.rotation.x += 0.005;
            s.renderer.render(s.scene, s.camera);
        });
    }
}

// Stats counter logic
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const updateCounter = () => {
                    const count = +entry.target.innerText;
                    const increment = target / 50;
                    if (count < target) {
                        entry.target.innerText = Math.ceil(count + increment);
                        setTimeout(updateCounter, 20);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Mobile Menu Toggle
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const nav = document.querySelector('.nav-links');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}

// Reveal on Scroll
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// Cursor logic
function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    
    if (!dot || !ring) return;

    window.addEventListener('mousemove', (e) => {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    new TechScene();
    initCounters();
    initMobileMenu();
    initScrollReveal();
    initCursor();
    new ArchitectCarousel();
    
    // Scroll progress
    const progress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const perc = (window.pageYOffset / total) * 100;
        if (progress) progress.style.width = perc + '%';
    });
});