import os
import re

file_path = "src/app/(site)/agencias/AgenciasClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Reduce top padding
content = content.replace("pt-28", "pt-20 lg:pt-20")

# 2. Map container size
# h-[800px] lg:h-[550px] -> h-[600px] lg:h-[400px]
content = content.replace("h-[800px] lg:h-[550px]", "h-[600px] lg:h-[450px]")
content = content.replace("h-[350px] lg:h-full", "h-[250px] lg:h-full")
content = content.replace("h-[450px] lg:h-full", "h-[350px] lg:h-full")

# 3. Increase title size
content = content.replace("text-3xl sm:text-4xl", "text-4xl sm:text-5xl")

# 4. Remove dark mode filter from map to make it readable
content = content.replace("isDark ? 'filter contrast-125 saturate-50 invert' : ''", "''")

# 5. Add a big floating Google Maps button on the map
old_iframe = r'(<iframe[\s\S]*?className={`w-full h-full transition-all \$\{[\s\S]*?\}`}[\s\S]*?/>)'
new_iframe = r"""\1
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDistributor.latitude},${selectedDistributor.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6 z-30 px-5 py-3 bg-white text-slate-900 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-slate-50 transition-transform hover:scale-105 active:scale-95 border border-slate-200"
                >
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <span>Abrir en Google Maps</span>
                </a>"""
content = re.sub(old_iframe, new_iframe, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Agencias updated.")
