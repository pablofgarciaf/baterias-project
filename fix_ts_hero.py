with open('src/context/SiteContentContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'backgroundImage: string;\n    stat1Value: string;',
    'backgroundImage: string;\n    mobileImage?: string;\n    stat1Value: string;'
)

with open('src/context/SiteContentContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
