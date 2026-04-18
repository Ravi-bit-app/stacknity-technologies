import os

html_file = "index.html"

with open(html_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_html = []
in_style = False
in_script = False

style_lines = []
script_lines = []

for line in lines:
    if line.strip() == "<style>":
        in_style = True
        new_html.append('    <link rel="stylesheet" href="assets/css/style.css">\n')
        continue
    elif line.strip() == "</style>":
        in_style = False
        continue

    if line.strip() == '<script type="module">':
        in_script = True
        new_html.append('    <script type="module" src="assets/js/main.js"></script>\n')
        continue
    elif in_script and line.strip() == "</script>":
        in_script = False
        continue

    if in_style:
        style_lines.append(line)
    elif in_script:
        script_lines.append(line)
    else:
        new_html.append(line)

if style_lines or script_lines:
    os.makedirs('assets/css', exist_ok=True)
    os.makedirs('assets/js', exist_ok=True)

    if style_lines:
        with open('assets/css/style.css', 'w', encoding='utf-8') as f:
            f.writelines(style_lines)

    if script_lines:
        with open('assets/js/main.js', 'w', encoding='utf-8') as f:
            f.writelines(script_lines)

    with open(html_file, 'w', encoding='utf-8') as f:
        f.writelines(new_html)

    print("Extraction complete.")
else:
    print("No inline scripts or styles found. Files unchanged.")
