import re

with open('src/components/Hero.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the title bigger and tracking tighter
content = content.replace(
    'text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-display font-bold tracking-tight leading-[1.05] text-white',
    'text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-display font-extrabold tracking-tighter leading-[1.05] text-white drop-shadow-sm'
)

# Replace the initial animation of H1 to have a blur reveal
content = content.replace(
    'initial={{ opacity: 0, y: 16 }}',
    'initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}'
)
content = content.replace(
    'animate={{ opacity: 1, y: 0 }}',
    'animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}'
)

# Make the CTAs Apple-like
# Primary CTA: Solid white, text-black, slight scale, heavy shadow
# Secondary CTA: Glassmorphism

content = content.replace(
    'px-6 py-3 rounded-full bg-white text-slate-950 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97]',
    'px-7 py-3.5 rounded-full bg-white text-slate-950 text-sm font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 active:scale-[0.98] hover:bg-slate-50'
)

content = content.replace(
    'px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-[0.97]',
    'px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-xl text-white text-sm font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 active:scale-[0.98]'
)

with open('src/components/Hero.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
