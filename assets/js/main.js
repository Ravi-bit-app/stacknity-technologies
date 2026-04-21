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
        
        if (this.bgContainer) {
            this.initBackground();
        }
        
        if (this.heroContainer) {
            this.initHero();
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
        this.heroRenderer.render(this.heroScene, this.heroCamera);
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
    
    // Scroll progress
    const progress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const perc = (window.pageYOffset / total) * 100;
        if (progress) progress.style.width = perc + '%';
    });
});