import os
import re

file_path = "src/app/(site)/nosotros/NosotrosClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the Hero section
old_hero = r'\{/\* Hero 100vh con imagen de fondo y stats \*/\}[\s\S]*?\{/\* Values Grid - Clean Flat Design \*/\}'
new_hero = """{/* Hero - Split on mobile, full on desktop */}
      <section className="relative flex flex-col lg:h-screen lg:min-h-[600px] lg:flex-row lg:items-end overflow-hidden -mt-14 lg:-mt-16 bg-slate-950">
        
        {/* Mobile Text (Top) */}
        <div className="lg:hidden container-max pt-32 pb-8 z-10 w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border bg-amber-500/20 border-amber-400/30 text-amber-300">
              <Award className="w-3 h-3" />
              {about.badge}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white mb-4">
              {about.title}
            </h1>
            <p className="text-sm leading-relaxed text-white/70">
              {about.paragraph1}
            </p>
          </motion.div>
        </div>

        {/* Image */}
        <div className="relative w-full h-[300px] lg:absolute lg:inset-0 lg:h-full lg:z-0">
          <picture className="absolute inset-0">
            <source media="(max-width: 767px)" srcSet="/quienes-somos-section-landing.webp" type="image/webp" />
            <source media="(min-width: 768px)" srcSet="/quienes-somos-hero-desktop.webp" type="image/webp" />
            <img
              src="/quienes-somos-hero-desktop.webp"
              alt="Corporación Maresa – Quiénes Somos"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent lg:from-black/80 lg:via-black/30 lg:to-black/10" />
        </div>

        {/* Desktop Text (Bottom overlay) */}
        <div className="hidden lg:block container-max relative z-10 pb-14 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border bg-amber-500/20 border-amber-400/30 text-amber-300">
              <Award className="w-3.5 h-3.5" />
              {about.badge}
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
              {about.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed max-w-2xl text-white/70">
              {about.paragraph1}
            </p>
          </motion.div>
        </div>
        
        {/* Stats */}
        <div className="container-max relative z-10 lg:absolute lg:bottom-14 lg:right-0 w-full lg:w-auto pb-10 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 lg:flex gap-3"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center lg:w-32"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] font-medium mt-1 text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Grid - Clean Flat Design */}"""

content = re.sub(old_hero, new_hero, content, flags=re.DOTALL)

# Add animations back to Values Grid
old_grid = r'(<div\s+key=\{i\}\s+className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-shadow hover:shadow-md")'
new_grid = r"""<motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative bg-white dark:bg-slate-800 rounded-[20px] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1"
                >"""
content = re.sub(old_grid, new_grid, content)
content = content.replace("</div>\n              ))}\n            </div>", "</motion.div>\n              ))}\n            </div>")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Nosotros Hero updated.")
