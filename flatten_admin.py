import os
import re

file_path = "src/components/admin/ContentEditor.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make GlassSection completely flat and clean
flat_glass = """const GlassSection = ({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) => (
  <div
    className={`p-6 sm:p-8 rounded-[16px] border ${
      darkMode
        ? 'bg-[#121826] border-slate-800'
        : 'bg-white border-slate-200 shadow-sm'
    }`}
  >
    {children}
  </div>
);"""
content = re.sub(r'const GlassSection = \(\{ children, darkMode \}: \{ children: React\.ReactNode; darkMode: boolean \}\) => \([\s\S]*?\</div\>\s*\);', flat_glass, content)

# Make inputs flat
flat_input = """const inputCls = `w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors ${
    darkMode
      ? 'bg-[#1A2235] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600'
  }`;"""
content = re.sub(r'const inputCls = `w-full px-4 py-3\.5 rounded-\[16px\] border text-sm outline-none transition-all \$\{[\s\S]*?}`;', flat_input, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

# Now flatten AdminShell.tsx
shell_path = "src/components/admin/AdminShell.tsx"
with open(shell_path, "r", encoding="utf-8") as f:
    shell = f.read()

shell = shell.replace('bg-[#060B14]', 'bg-[#0B121A]') # flat dark side
shell = shell.replace('bg-[#0A0F1C]', 'bg-[#080D14]') # flat dark main

with open(shell_path, "w", encoding="utf-8") as f:
    f.write(shell)

print("Admin flattened.")
