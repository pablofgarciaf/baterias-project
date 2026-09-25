with open('src/types/admin.ts', 'r', encoding='utf-8') as f:
    content = f.read()

original = "    whatsappCtaText: string;\n  };"
replacement = "    whatsappCtaText: string;\n    heroDesktop?: string;\n    heroMobile?: string;\n  };"
content = content.replace(original, replacement)

original_b2b = "    submitButtonColor?: string;\n  };"
replacement_b2b = "    submitButtonColor?: string;\n    benefits?: Array<{title: string, desc: string, icon?: any}>;\n  };"
content = content.replace(original_b2b, replacement_b2b)

with open('src/types/admin.ts', 'w', encoding='utf-8') as f:
    f.write(content)
