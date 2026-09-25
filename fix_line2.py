import os

file_path = "src/app/(site)/nosotros/NosotrosClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

if "</div>" in lines[282]:
    lines[282] = lines[282].replace("</div>", "</motion.div>")

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Fixed line 283.")
