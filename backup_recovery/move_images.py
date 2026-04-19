import os
import shutil
import glob

brain_dir = r"C:\Users\welcome\.gemini\antigravity\brain\7f6b9416-9c91-4520-be7e-22927cfaf8f3"
dest_dir = r"d:\Stacknity Group\Stacknity Technologies\assets\images"

os.makedirs(dest_dir, exist_ok=True)

# Map prefix to new name
mappings = {
    "mobile_development_hero": "mobile-development-hero.png",
    "web_platforms_hero": "web-platforms-hero.png",
    "digital_marketing_hero": "digital-marketing-hero.png",
    "staff_augmentation_hero": "staff-augmentation-hero.png",
    "about_us_hero": "about-us-hero.png",
    "careers_hero": "careers-hero.png"
}

for file in glob.glob(os.path.join(brain_dir, "*.png")):
    filename = os.path.basename(file)
    for prefix, new_name in mappings.items():
        if filename.startswith(prefix):
            shutil.copy(file, os.path.join(dest_dir, new_name))
            print(f"Copied {filename} to {new_name}")

html_files = glob.glob(r"d:\Stacknity Group\Stacknity Technologies\*.html")
for html_file in html_files:
    if "index.html" in html_file:
        continue
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(".webp", ".png")
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {os.path.basename(html_file)}")
