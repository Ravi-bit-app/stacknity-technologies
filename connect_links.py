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
    <section class="hero" style="min-height: 50vh; padding-top: 150px;">
        <div class="hero-grid-bg"></div>
        <div class="hero-content">
            <div class="hero-badge">Action</div>
            <h1>Start a Project</h1>
            <p>Kickstart your digital transformation with our elite engineering team.</p>
        </div>
    </section>

    <section class="services" style="padding: 100px 5%; text-align: center;">
        <div class="service-card reveal" style="max-width: 800px; margin: 0 auto; padding: 50px;">
            <h2>Tell us about your vision</h2>
            <p style="color: rgba(255,255,255,0.7); margin-bottom: 30px;">Fill out the details, and we'll schedule a discovery call.</p>
            <form style="display: flex; flex-direction: column; gap: 20px;">
                <input type="text" placeholder="Your Name" style="padding: 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                <input type="email" placeholder="Your Work Email" style="padding: 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                <textarea placeholder="Project Details" rows="5" style="padding: 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;"></textarea>
                <button type="submit" class="btn-primary" style="align-self: center; border: none; cursor: pointer;">Submit Request</button>
            </form>
        </div>
    </section>
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
