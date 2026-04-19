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

    # Pass 1: Collect
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract <style> contents
        styles = re.findall(r'<style>(.*?)</style>', content, re.DOTALL)
        for s in styles:
            all_styles.add(s.strip())
            
        # Extract internal <script> (NOT importmap, NOT src)
        scripts = re.findall(r'<script(?![^>]*src=)(?![^>]*type="importmap")[^>]*>(.*?)</script>', content, re.DOTALL)
        for s in scripts:
            if s.strip():
                all_scripts.add(s.strip())

    # Save assets
    os.makedirs('assets/css', exist_ok=True)
    os.makedirs('assets/js', exist_ok=True)

    if all_styles:
        styles_content = "\n\n".join(sorted(list(all_styles)))
        with open('assets/css/style.css', 'w', encoding='utf-8') as f:
            f.write(styles_content)

    if all_scripts:
        js_content = "import * as THREE from 'three';\n\n"
        cleaned_scripts = []
        for s in sorted(list(all_scripts)):
            cleaned = re.sub(r"import .* from 'three';", "", s).strip()
            if cleaned:
                cleaned_scripts.append(cleaned)
        js_content += "\n\n".join(cleaned_scripts)
        with open('assets/js/main.js', 'w', encoding='utf-8') as f:
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
                # Fallback if no head tag
                content = IMPORT_MAP + "\n" + content

        # 3. Ensure CSS link
        if 'assets/css/style.css' not in content:
            if '</head>' in content:
                content = content.replace('</head>', '    <link rel="stylesheet" href="assets/css/style.css">\n</head>')
            else:
                content = '<link rel="stylesheet" href="assets/css/style.css">\n' + content

        # 4. Ensure JS module link at bottom
        if 'assets/js/main.js' not in content:
            if '</body>' in content:
                content = content.replace('</body>', '    <script type="module" src="assets/js/main.js"></script>\n</body>')
            else:
                content = content + '\n<script type="module" src="assets/js/main.js"></script>'
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Verified & Restructured {file_path}")

if __name__ == "__main__":
    restructure_all()
