import os
import glob
import re

# 1. First, generate start-project.html
def generate_start_project():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    head_end = content.find('</nav>') + 6
    footer_start = content.find('<footer>')
    header = content[:head_end]
    footer = content[footer_start:]

    body = """
    <section class="hero" style="min-height: 40vh; padding-top: 150px; padding-bottom: 50px;">
        <div class="hero-grid-bg"></div>
        <div class="hero-content">
            <div class="hero-badge">Start Your Journey</div>
            <h1>Start a Project</h1>
            <p>Kickstart your digital transformation with our elite engineering team. Share your vision below.</p>
        </div>
    </section>

    <section class="services" style="padding: 50px 5% 100px; display: flex; justify-content: center;">
        <div class="split-container" style="display: flex; flex-wrap: wrap; max-width: 1200px; width: 100%; gap: 40px; background: rgba(255,255,255,0.02); border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); padding: 40px; backdrop-filter: blur(20px);">
            
            <!-- LEFT: 3D Asset Area -->
            <div class="3d-area" style="flex: 1; min-width: 300px; border-radius: 16px; background: rgba(0,0,0,0.3); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; min-height: 400px; box-shadow: inset 0 0 50px rgba(0,229,255,0.05);">
                <div id="form-3d-canvas" style="width: 100%; height: 100%; position: absolute; top:0; left:0;"></div>
                <div style="position: absolute; bottom: 20px; left: 20px; color: rgba(255,255,255,0.4); font-size: 12px; pointer-events: none;">Interactive WebGL Element</div>
            </div>

            <!-- RIGHT: Glassmorphism Form -->
            <div class="form-area" style="flex: 1; min-width: 350px; display: flex; flex-direction: column; justify-content: center;">
                <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 32px; margin-bottom: 10px; color: white;">Connect with <span style="background: linear-gradient(135deg, #00E5FF, #8A2BE2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Stacknity</span></h2>
                <p style="color: rgba(255,255,255,0.55); margin-bottom: 30px; font-size: 15px;">Secure architecture. Premium design. Flawless execution.</p>
                
                <form action="#" method="POST" style="display: flex; flex-direction: column; gap: 20px;">
                    <div style="position: relative;">
                        <input type="text" id="name" placeholder=" " required style="width: 100%; padding: 18px 20px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: all 0.3s; font-family: 'Inter', sans-serif;" onfocus="this.style.borderColor='#00E5FF'; this.style.background='rgba(0,229,255,0.05)';" onblur="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.04)';">
                        <label for="name" style="position: absolute; left: 20px; top: 18px; color: rgba(255,255,255,0.4); pointer-events: none; transition: 0.3s; font-size: 15px;">Your Full Name</label>
                    </div>

                    <div style="position: relative;">
                        <input type="email" id="email" placeholder=" " required style="width: 100%; padding: 18px 20px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: all 0.3s; font-family: 'Inter', sans-serif;" onfocus="this.style.borderColor='#8A2BE2'; this.style.background='rgba(138,43,226,0.05)';" onblur="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.04)';">
                        <label for="email" style="position: absolute; left: 20px; top: 18px; color: rgba(255,255,255,0.4); pointer-events: none; transition: 0.3s; font-size: 15px;">Work Email Address</label>
                    </div>
                    
                    <div style="position: relative;">
                        <select id="budget" required style="width: 100%; padding: 18px 20px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); outline: none; transition: all 0.3s; font-family: 'Inter', sans-serif; appearance: none; cursor: pointer;" onfocus="this.style.borderColor='#00E5FF';" onblur="this.style.borderColor='rgba(255,255,255,0.1)';">
                            <option value="" disabled selected>Select Budget Range</option>
                            <option value="10k-25k" style="background: #0B1E33;">$10,000 - $25,000</option>
                            <option value="25k-50k" style="background: #0B1E33;">$25,000 - $50,000</option>
                            <option value="50k+" style="background: #0B1E33;">$50,000+</option>
                        </select>
                        <div style="position: absolute; right: 20px; top: 18px; pointer-events: none; color: rgba(255,255,255,0.5);">▼</div>
                    </div>

                    <div style="position: relative;">
                        <textarea id="details" placeholder=" " required rows="4" style="width: 100%; padding: 18px 20px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: all 0.3s; font-family: 'Inter', sans-serif; resize: vertical;" onfocus="this.style.borderColor='#8A2BE2'; this.style.background='rgba(138,43,226,0.05)';" onblur="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.04)';"></textarea>
                        <label for="details" style="position: absolute; left: 20px; top: 18px; color: rgba(255,255,255,0.4); pointer-events: none; transition: 0.3s; font-size: 15px;">Project Details</label>
                    </div>

                    <button type="submit" class="btn-primary" style="align-self: flex-start; border: none; cursor: pointer; padding: 18px 40px; font-size: 16px; margin-top: 10px; width: 100%; justify-content: center;">Initialize Project <span style="margin-left: 8px;">→</span></button>
                    <p style="font-size: 12px; color: rgba(255,255,255,0.3); text-align: center; margin-top: 10px;">By submitting, you agree to our Privacy Policy.</p>
                </form>
            </div>
        </div>
    </section>

    <style>
        /* Floating label logic */
        input:focus + label, input:not(:placeholder-shown) + label,
        textarea:focus + label, textarea:not(:placeholder-shown) + label {
            transform: translateY(-26px) scale(0.85);
            left: 10px !important;
            color: #00E5FF !important;
            background: #060d18;
            padding: 0 5px;
            border-radius: 4px;
        }
        textarea:focus + label, textarea:not(:placeholder-shown) + label {
            color: #8A2BE2 !important;
        }
    </style>

    <script>
        // Localized 3D Asset for the Form Geometry
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('form-3d-canvas');
            if (!container || typeof THREE === 'undefined') return;

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
    </script>
"""
    with open('start-project.html', 'w', encoding='utf-8') as out:
        out.write(header + "\n" + body + "\n" + footer)

# 2. Update all links
def update_links():
    html_files = glob.glob('*.html')
    
    # Pre-compute replacements
    replacements = [
        ('<a href="#services">Services</a>', '<a href="index.html#services">Services</a>'),
        ('<a href="#process">How We Work</a>', '<a href="index.html#process">How We Work</a>'),
        ('<a href="#team">Team</a>', '<a href="index.html#team">Team</a>'),
        ('<a href="#testimonials">Testimonials</a>', '<a href="index.html#testimonials">Testimonials</a>'),
        ('<a href="#cta" class="nav-cta">Get Started</a>', '<a href="start-project.html" class="nav-cta">Get Started</a>'),
        ('<a href="#cta" class="btn-primary">Start a Project', '<a href="start-project.html" class="btn-primary">Start a Project'),
        ('<a href="#" class="btn-primary">Schedule a Call', '<a href="tel:9667044431" class="btn-primary">Schedule a Call 📞 9667044431'),
        ('<a href="#">Mobile Development</a>', '<a href="mobile-development.html">Mobile Development</a>'),
        ('<a href="#">Web Platforms</a>', '<a href="web-platforms.html">Web Platforms</a>'),
        ('<a href="#">Digital Marketing</a>', '<a href="digital-marketing.html">Digital Marketing</a>'),
        ('<a href="#">Staff Augmentation</a>', '<a href="staff-augmentation.html">Staff Augmentation</a>'),
        ('<a href="#">About Us</a>', '<a href="about-us.html">About Us</a>'),
        ('<a href="#">Careers</a>', '<a href="careers.html">Careers</a>'),
        ('<a href="#">Blog</a>', '<a href="blog.html">Blog</a>'),
        ('<a href="#">Contact</a>', '<a href="contact.html">Contact</a>'),
        ('<a href="#">Privacy Policy</a>', '<a href="privacy-policy.html">Privacy Policy</a>'),
        ('<a href="#">Terms of Service</a>', '<a href="terms-of-service.html">Terms of Service</a>'),
        ('<a href="#">Cookie Policy</a>', '<a href="cookie-policy.html">Cookie Policy</a>'),
        ('<a href="#" class="eco-logo"><span class="dot"></span> Stacknity.ai</a>', '<a href="https://stacknity.ai" class="eco-logo" target="_blank"><span class="dot"></span> Stacknity.ai</a>'),
        ('<a href="#" class="logo">', '<a href="index.html" class="logo">')
    ]

    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        for old, new in replacements:
            content = content.replace(old, new)
            
        # Special case for Email button: The text spans multiple lines
        # We will replace the generic href="#" block with direct mailto + gmail/outlook
        
        email_block_pattern = r'<a href="#" class="btn-cta-secondary">\s*<svg[^>]+>\s*<path[^>]+/>\s*<polyline[^>]+/>\s*</svg>\s*hello@stacknity\.com\s*</a>'
        email_replacement = r'''
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="mailto:hello@stacknity.com" class="btn-cta-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
                Email Us
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@stacknity.com" target="_blank" class="btn-cta-secondary" style="border-color: #DB4437; color: #DB4437;">Gmail</a>
            <a href="https://outlook.office.com/mail/deeplink/compose?to=hello@stacknity.com" target="_blank" class="btn-cta-secondary" style="border-color: #0078D4; color: #0078D4;">Outlook</a>
        </div>
        '''
        
        content = re.sub(email_block_pattern, email_replacement, content, flags=re.IGNORECASE|re.DOTALL)
        
        # Another case where email is just typed text: "hello@stacknity.com" -> just do it globally if we missed it
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"Updated links in {file}")

if __name__ == "__main__":
    generate_start_project()
    update_links()
