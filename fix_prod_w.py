import os

file_path = "src/components/Products.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("w-[300px] sm:w-[340px] md:w-[360px]", "w-[280px] sm:w-[300px] md:w-[320px]")
# Ensure arrows don't cover cards on desktop
content = content.replace("-mx-4 px-4 sm:mx-0 sm:px-2", "-mx-4 px-4 sm:-mx-8 sm:px-8")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Products width adjusted.")
