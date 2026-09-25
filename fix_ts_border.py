with open('src/components/admin/ContentEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'style={{ borderColor: styles.borderColor }}',
    'style={{ border: styles.border }}'
)

with open('src/components/admin/ContentEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
