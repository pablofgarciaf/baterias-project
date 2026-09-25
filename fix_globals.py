import re

with open('src/app/globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the dark mode background pure luxury
content = content.replace(
    '--color-background: #0f172a; /* slate-900 */',
    '--color-background: #09090b; /* zinc-950 luxury */'
)
content = content.replace(
    '--color-foreground: #f8fafc; /* slate-50 */',
    '--color-foreground: #fafafa; /* zinc-50 */'
)

# Smooth scroll behavior globally
if 'scroll-behavior: smooth;' not in content:
    content = content.replace(
        '@layer base {',
        '@layer base {\n  html {\n    scroll-behavior: smooth;\n  }'
    )

with open('src/app/globals.css', 'w', encoding='utf-8') as f:
    f.write(content)
