import os
import re

file_path = "src/components/HeroReciclaje.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix Reciclaje Mobile Buttons (no overlap)
old_buttons = r'<div className="flex flex-wrap items-center gap-3 w-full mt-4">.*?</div>'
new_buttons = """<div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full mt-4">
              <Link
                href="#puntos-de-venta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97]"
              >
                <Leaf className="w-4 h-4" />
                {rec.ctaButtonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/contacto-b2b"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-[0.97]"
              >
                <MapPin className="w-4 h-4" />
                {rec.secondaryButtonText || 'Puntos de Venta'}
              </Link>

              <Link
                href="tel:1800228374"
                className="w-full sm:hidden inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97]"
              >
                <PhoneCall className="w-4 h-4" />
                1-800-BATERIA
              </Link>
            </div>"""
content = re.sub(old_buttons, new_buttons, content, flags=re.DOTALL)

# Fix Reciclaje Stats bottom bar for mobile
old_stats = r'\{/\* Stats - Bottom Bar \*/\}.*?</motion\.div>'
new_stats = """{/* Stats - Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-3 sm:py-5">
            {/* Desktop layout */}
            <div className="hidden sm:flex flex-wrap justify-around gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <stat.icon className="w-6 h-6 text-emerald-400" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-none">{stat.value}</span>
                    <span className="text-xs text-emerald-100/80 uppercase font-bold tracking-wider mt-0.5">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile layout (2 columns top, 1 bottom) */}
            <div className="flex flex-col sm:hidden gap-3">
              <div className="grid grid-cols-2 gap-3 divide-x divide-white/10">
                {stats.slice(0, 2).map((stat, i) => (
                  <div key={i} className="flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-white leading-none">{stat.value}</span>
                    <span className="text-[10px] text-emerald-100/80 uppercase font-bold tracking-wider mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-2 flex flex-col items-center justify-center text-center">
                 <span className="text-lg font-bold text-white leading-none">{stats[2].value}</span>
                 <span className="text-[10px] text-emerald-100/80 uppercase font-bold tracking-wider mt-1">{stats[2].label}</span>
              </div>
            </div>
          </div>
        </motion.div>"""
content = re.sub(old_stats, new_stats, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("HeroReciclaje updated.")
