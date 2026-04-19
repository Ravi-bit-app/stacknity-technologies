import os
import glob
import re

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
            
        # Extract <script> contents (internal only, no src)
        scripts = re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>', content, re.DOTALL)
        for s in scripts:
            if s.strip():
                all_scripts.add(s.strip())

    # Save assets
    os.makedirs('assets/css', exist_ok=True)
    os.makedirs('assets/js', exist_ok=True)

    if all_styles:
        with open('assets/css/style.css', 'w', encoding='utf-8') as f:
            f.write("\n\n".join(all_styles))

    if all_scripts:
        js_content = "import * as THREE from 'three';\n\n"
        cleaned_scripts = []
        for s in all_scripts:
            # Clean up redundant imports
            cleaned = re.sub(r"import .* from 'three';", "", s).strip()
            if cleaned:
                cleaned_scripts.append(cleaned)
        js_content += "\n\n".join(cleaned_scripts)
        with open('assets/js/main.js', 'w', encoding='utf-8') as f:
            f.write(js_content)

    # Pass 2: Clean HTML
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Remove <style> blocks
        content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)
        # Ensure CSS link is in <head>
        if 'assets/css/style.css' not in content:
            content = content.replace('</head>', '    <link rel="stylesheet" href="assets/css/style.css">\n</head>')

        # Remove internal <script> blocks
        content = re.sub(r'<script(?![^>]*src=)[^>]*>.*?</script>', '', content, flags=re.DOTALL)
        # Ensure main.js module is at bottom
        if 'assets/js/main.js' not in content:
            content = content.replace('</body>', '    <script type="module" src="assets/js/main.js"></script>\n</body>')
        
        # Final cleanup for potential duplicates introduced by string replacement
        # (Though regex/string replacement here is safer if we just check inclusion)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Restructured {file_path}")

if __name__ == "__main__":
    restructure_all()
