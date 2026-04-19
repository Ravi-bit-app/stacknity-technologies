import os

PAGES = {
    "Services": [
        "mobile-development",
        "web-platforms",
        "digital-marketing",
        "staff-augmentation"
    ],
    "Company": [
        "about-us",
        "careers",
        "blog",
        "contact"
    ],
    "Legal": [
        "privacy-policy",
        "terms-of-service",
        "cookie-policy"
    ]
}

def generate_pages():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract header/nav and footer
    head_end = content.find('</nav>') + 6
    footer_start = content.find('<footer>')

    if head_end == 5 or footer_start == -1:
        print("Couldn't find standard structure in index.html")
        return

    header = content[:head_end]
    footer = content[footer_start:]

    for category, pages in PAGES.items():
        for page in pages:
            filename = f"{page}.html"
            title = page.replace('-', ' ').title()
            
            body = f"""
    <section class="hero" style="min-height: 50vh; padding-top: 150px;">
        <div class="hero-grid-bg"></div>
        <div class="hero-content">
            <div class="hero-badge">{category}</div>
            <h1>{title}</h1>
            <p>Premium {title.lower()} solutions engineered with precision to elevate your digital empire.</p>
        </div>
    </section>

    <section class="services" style="padding: 100px 5%;">
        <div class="service-card reveal" style="max-width: 800px; margin: 0 auto; text-align: center;">
            <img src="assets/images/{page}-hero.webp" alt="{title}" style="width: 100%; border-radius: 20px; margin-bottom: 40px; box-shadow: 0 20px 40px rgba(0,229,255,0.1);">
            <h2>Empowering your {title.lower()} journey</h2>
            <p style="color: rgba(255,255,255,0.7); font-size: 1.1rem; line-height: 1.8;">Our expert team is ready to deploy state-of-the-art strategies and robust architectures tailored for your specific needs in {title}. Partner with Stacknity to redefine industry standards.</p>
        </div>
    </section>
"""
            page_content = header + "\n" + body + "\n" + footer
            
            with open(filename, 'w', encoding='utf-8') as out:
                out.write(page_content)
            
            print(f"Generated {filename}")

if __name__ == "__main__":
    generate_pages()
