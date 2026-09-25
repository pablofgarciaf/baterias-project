import os
import re

file_path = "src/components/HeroReciclaje.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix the buttons
old_buttons = r'<div className="flex flex-col sm:flex-row gap-3 w-full">[\s\S]*?</div>\s*\{/\* Row 2: 1 button full width on mobile only \*/\}[\s\S]*?</div>'

new_buttons = """<div className="flex flex-wrap items-center gap-3 w-full mt-4">
              <Link
                href="#puntos-de-venta"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97] hover:-translate-y-px"
              >
                <Leaf className="w-4 h-4" />
                {rec.ctaButtonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/contacto-b2b"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-[0.97]"
              >
                <MapPin className="w-4 h-4" />
                {rec.secondaryButtonText || 'Puntos de Venta'}
              </Link>

              <Link
                href="tel:1800228374"
                className="inline-flex sm:hidden items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97]"
              >
                <PhoneCall className="w-4 h-4" />
                1-800-BATERIA
              </Link>
            </div>"""

content = re.sub(old_buttons, new_buttons, content)

# 2. Fix the stats block - put it at the absolute bottom
old_stats = r'\{/\* Stats.*?\{/\* Row 2: 1 stat centered \*/\}[\s\S]*?</div>\s*</motion\.div>\s*\)\}'

new_stats = """{/* Stats - Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 bg-slate-900/40 backdrop-blur-md border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-4 sm:py-5 flex flex-wrap justify-center sm:justify-around gap-6 sm:gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold text-white leading-none">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs text-emerald-100/80 uppercase font-semibold tracking-wider mt-0.5">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>"""

content = re.sub(old_stats, new_stats, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("HeroReciclaje.tsx updated.")
