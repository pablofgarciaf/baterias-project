with open('src/components/B2BLeadCapture.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<item.icon className="w-5 h-5" />', '<ItemIcon className="w-5 h-5" />')

with open('src/components/B2BLeadCapture.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
