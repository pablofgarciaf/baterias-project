import os

file_path = "src/app/(site)/nosotros/NosotrosClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# line 217 is index 216
if "</div>" in lines[216]:
    lines[216] = lines[216].replace("</div>", "</motion.div>")

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Fixed line 217.")
