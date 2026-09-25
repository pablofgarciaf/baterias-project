with open('src/context/SiteContentContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'whatsappCtaText: string;\n  };',
    'whatsappCtaText: string;\n    heroDesktop?: string;\n    heroMobile?: string;\n  };'
)

with open('src/context/SiteContentContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
