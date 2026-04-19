import os
import re

files_to_fix = [
    "blog.html",
    "contact.html",
    "privacy-policy.html",
    "terms-of-service.html",
    "cookie-policy.html"
]

for filename in files_to_fix:
    path = os.path.join(r"d:\Stacknity Group\Stacknity Technologies", filename)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove the img tag using regex
    content = re.sub(r'<img src="assets/images/[a-z\-]+-hero\.png".*?>', '', content)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Fixed {filename}")
