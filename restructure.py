import os
import glob
import re

IMPORT_MAP = """    <script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
        }
    }
    </script>"""

def restructure_all():
    html_files = glob.glob("*.html")
    all_styles = set()
    all_scripts = set()

    # SAFETY: Read existing assets to avoid data loss
    style_path = 'assets/css/style.css'
    if os.path.exists(style_path):
        with open(style_path, 'r', encoding='utf-8') as f:
            # We treat the existing file as a single "block" or we can split it.
            # Splitting by comments or double newlines is safer for deduplication.
            existing_styles = f.read().split("\n\n")
            for s in existing_styles:
                if s.strip():
                    all_styles.add(s.strip())

    js_path = 'assets/js/main.js'
    if os.path.exists(js_path):
        with open(js_path, 'r', encoding='utf-8') as f:
            existing_js = f.read()
            # Remove the default import line if we're going to re-add it
            existing_js = re.sub(r"import .* from 'three';", "", existing_js).strip()
            if existing_js:
                all_scripts.add(existing_js)

    # Pass 1: Collect from HTML
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract <style> contents
        styles = re.findall(r'<style>(.*?)</style>', content, re.DOTALL)
        for s in styles:
            if s.strip():
                all_styles.add(s.strip())
            
        # Extract internal <script> (NOT importmap, NOT src)
        scripts = re.findall(r'<script(?![^>]*src=)(?![^>]*type="importmap")[^>]*>(.*?)</script>', content, re.DOTALL)
        for s in scripts:
            if s.strip():
                # Avoid adding the exact same logic multiple times
                all_scripts.add(s.strip())

    # Save assets
    os.makedirs('assets/css', exist_ok=True)
    os.makedirs('assets/js', exist_ok=True)

    if all_styles:
        # Deduplicate and sort
        with open(style_path, 'w', encoding='utf-8') as f:
            f.write("\n\n".join(sorted(list(all_styles))))

    if all_scripts:
        js_content = "import * as THREE from 'three';\n\n"
        cleaned_scripts = []
        for s in sorted(list(all_scripts)):
            cleaned = re.sub(r"import .* from 'three';", "", s).strip()
            if cleaned:
                cleaned_scripts.append(cleaned)
        js_content += "\n\n".join(cleaned_scripts)
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)

    # Pass 2: Clean HTML and Inject Import Map
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 1. Remove internal style/script blocks (NOT importmap)
        content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)
        content = re.sub(r'<script(?![^>]*src=)(?![^>]*type="importmap")[^>]*>.*?</script>', '', content, flags=re.DOTALL)

        # 2. Ensure Import Map is in <head>
        if 'type="importmap"' not in content:
            if '<head>' in content:
                content = content.replace('<head>', f'<head>\n{IMPORT_MAP}')
            else:
                content = IMPORT_MAP + "\n" + content

        # 3. Ensure CSS link
        if 'assets/css/style.css' not in content:
            if '</head>' in content:
                content = content.replace('</head>', '    <link rel="stylesheet" href="assets/css/style.css">\n</head>')

        # 4. Ensure JS module link
        if 'assets/js/main.js' not in content:
            if '</body>' in content:
                content = content.replace('</body>', '    <script type="module" src="assets/js/main.js"></script>\n</body>')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Secured & Restructured {file_path}")

if __name__ == "__main__":
    restructure_all()
