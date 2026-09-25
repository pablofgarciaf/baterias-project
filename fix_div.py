import os

file_path = "src/components/Products.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# line 516 is index 515
if "</div>" in lines[515]:
    del lines[515]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Products.tsx div fixed.")
