with open('src/context/SiteContentContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'submitButtonText: string;\n    submitButtonColor: string;\n  };',
    'submitButtonText: string;\n    submitButtonColor: string;\n    benefits?: any[];\n  };'
)

with open('src/context/SiteContentContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
