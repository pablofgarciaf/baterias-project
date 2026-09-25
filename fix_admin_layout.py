with open('src/app/admin/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove <html>, <head>, and <body> from AdminLayout
replacement = """  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {children}
    </div>
  );
"""

# Re-write the AdminLayout function
new_func = """export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}"""

content = re.sub(r'export default function AdminLayout.*\}', new_func, content, flags=re.DOTALL)

with open('src/app/admin/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
