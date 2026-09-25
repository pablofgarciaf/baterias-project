import os
import re

# 1. AdminShell.tsx
file_path = "src/components/admin/AdminShell.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace plain flat backgrounds with the futuristic neon/glass styling
content = content.replace("bg-[#0B121A]", "bg-[#090C15]") # sidebar
content = content.replace("bg-[#080D14]", "bg-[#06080F] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#06080F] to-[#06080F]") # main content area
content = content.replace("border-slate-800", "border-indigo-500/20")
content = content.replace("border-slate-700", "border-indigo-500/30")
content = content.replace("bg-slate-800", "bg-indigo-950/40")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)


# 2. ContentEditor.tsx
file_path2 = "src/components/admin/ContentEditor.tsx"
with open(file_path2, "r", encoding="utf-8") as f:
    content2 = f.read()

# Replace GlassSection and inputCls
flat_glass = r'const GlassSection = \(\{ children, darkMode \}: \{ children: React\.ReactNode; darkMode: boolean \}\) => \([\s\S]*?\</div\>\s*\);'
futuristic_glass = """const GlassSection = ({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) => (
  <div
    className={`p-6 sm:p-8 rounded-[24px] border transition-all duration-300 ${
      darkMode
        ? 'bg-[#0F1423]/80 backdrop-blur-2xl border-indigo-500/20 shadow-[0_8px_32px_rgba(79,70,229,0.1)] hover:shadow-[0_8px_40px_rgba(79,70,229,0.15)] hover:border-indigo-500/30'
        : 'bg-white border-slate-200 shadow-xl'
    }`}
  >
    {children}
  </div>
);"""
content2 = re.sub(flat_glass, futuristic_glass, content2)

flat_input = r'const inputCls = `w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors \$\{[\s\S]*?}`;'
futuristic_input = """const inputCls = `w-full px-4 py-3.5 rounded-[16px] border text-sm outline-none transition-all duration-300 ${
    darkMode
      ? 'bg-[#0A0D16] border-indigo-500/20 text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-[#13192B] focus:shadow-[0_0_20px_rgba(79,70,229,0.2)]'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:shadow-md'
  }`;"""
content2 = re.sub(flat_input, futuristic_input, content2)

with open(file_path2, "w", encoding="utf-8") as f:
    f.write(content2)

print("Admin made futuristic again.")
