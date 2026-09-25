import os

file_path = "src/components/Blog.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("pt-24 lg:pt-32", "pt-16 lg:pt-16")
content = content.replace("py-24 lg:py-32", "py-16 lg:py-16")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Blog padding fixed.")
