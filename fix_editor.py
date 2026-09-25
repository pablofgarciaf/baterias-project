with open('src/components/admin/ContentEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("{renderField('Texto Botón Enviar'\n', 'submitButtonText')}", "{renderField('Texto Botón Enviar', 'submitButtonText')}")
content = content.replace("{renderField('Texto BotA3n Enviar'\n', 'submitButtonText')}", "{renderField('Texto Botón Enviar', 'submitButtonText')}")

with open('src/components/admin/ContentEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
