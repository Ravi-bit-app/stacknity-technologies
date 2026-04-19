import * as THREE from 'three';

// Localized 3D Asset for the Form Geometry
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('form-3d-canvas');
            if (!container) return;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            // Create a complex TorusKnot to represent an abstract "network/solution" 
            const geometry = new THREE.TorusKnotGeometry(10, 2.5, 200, 32, 2, 3);
            
            // Premium Wireframe + Solid Glow Material
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x00E5FF, 
                emissive: 0x8A2BE2,
                emissiveIntensity: 0.5,
                roughness: 0.2,
                metalness: 0.8,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
            
            const shape = new THREE.Mesh(geometry, material);
            scene.add(shape);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const pointLight1 = new THREE.PointLight(0x00E5FF, 2, 100);
            pointLight1.position.set(20, 20, 20);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x8A2BE2, 2, 100);
            pointLight2.position.set(-20, -20, 20);
            scene.add(pointLight2);

            camera.position.z = 40;

            // Mouse Interaction Parallax
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;

            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            });

            // Handle Resize
            window.addEventListener('resize', () => {
                if(!container) return;
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });

            function animate() {
                requestAnimationFrame(animate);
                
                targetX = mouseX * 0.5;
                targetY = mouseY * 0.5;

                // Rotate organically
                shape.rotation.x += 0.005;
                shape.rotation.y += 0.01;
                
                // Parallax based on mouse
                shape.rotation.x += 0.05 * (targetY - shape.rotation.x);
                shape.rotation.y += 0.05 * (targetX - shape.rotation.y);
                
                // Color pulse effect based on time
                const time = Date.now() * 0.001;
                material.emissiveIntensity = 0.4 + Math.sin(time) * 0.2;

                renderer.render(scene, camera);
            }
            animate();
        });

// Localized 3D Asset for the Form Geometry
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('form-3d-canvas');
            if (!container) return;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            // Create a complex TorusKnot to represent an abstract "network/solution" 
            const geometry = new THREE.TorusKnotGeometry(10, 2.5, 200, 32, 2, 3);
            
            // Premium Wireframe + Solid Glow Material
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x00E5FF, 
                emissive: 0x8A2BE2,
                emissiveIntensity: 0.5,
                roughness: 0.2,
                metalness: 0.8,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
            
            const shape = new THREE.Mesh(geometry, material);
            scene.add(shape);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const pointLight1 = new THREE.PointLight(0x00E5FF, 2, 100);
            pointLight1.position.set(20, 20, 20);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x8A2BE2, 2, 100);
            pointLight2.position.set(-20, -20, 20);
            scene.add(pointLight2);

            camera.position.z = 40;

            // Mouse Interaction Parallax
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;

            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            });

            // Handle Resize
            window.addEventListener('resize', () => {
                if(!container) return;
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });

            function animate() {
                requestAnimationFrame(animate);
                
                targetX = mouseX * 0.5;
                targetY = mouseY * 0.5;

                // Rotate organically
                shape.rotation.x += 0.005;
                shape.rotation.y += 0.01;
                
                // Parallax based on mouse
                shape.rotation.x += 0.05 * (targetY - shape.rotation.x);
                shape.rotation.y += 0.05 * (targetX - shape.rotation.y);
                
                // Color pulse effect based on time
                const time = Date.now() * 0.001;
                material.emissiveIntensity = 0.4 + Math.sin(time) * 0.2;

                renderer.render(scene, camera);
            }
            animate();
        });