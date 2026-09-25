import re

with open('src/components/Hero.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'initial={{ opacity: 0, y: 8 }}',
    'initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}'
)

# Subtitle
content = content.replace(
    'animate={{ opacity: 1, y: 0 }}',
    'animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}'
)

with open('src/components/Hero.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
