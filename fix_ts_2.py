with open('src/types/admin.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# StoreLocator type is likely defined there. Let's find "storeLocator"
# It probably says "storeLocator: {"
content = content.replace(
    'whatsappCtaText: string;\n  };',
    'whatsappCtaText: string;\n    heroDesktop?: string;\n    heroMobile?: string;\n  };'
)

with open('src/types/admin.ts', 'w', encoding='utf-8') as f:
    f.write(content)
