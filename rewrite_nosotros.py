import os
import re

file_path = "src/app/(site)/nosotros/NosotrosClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I want to rewrite the Values Grid section
# Find the Values Grid section
old_grid = r'\{/\* Values Grid \*/\}.*?\{/\* Timeline \*/\}'

new_grid = """{/* Values Grid - Clean Flat Design */}
      <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/50">
        <div className="container-max">
          <div className="mb-16 text-center">
            <span className="inline-flex items-center justify-center px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-full">
              Nuestro Propósito
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Lo que nos impulsa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
              {values.map((item, i) => (
                <div
                  key={i}
                  className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-shadow hover:shadow-md"
                >
                  <div className="p-10 flex-1 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6">
                      <item.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 uppercase">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                      {item.text}
                    </p>
                  </div>
                  {/* Bottom Ribbon */}
                  <div className={`h-3 w-full ${i % 2 === 0 ? 'bg-amber-500' : 'bg-primary-600'}`} />
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Timeline */}"""

content = re.sub(old_grid, new_grid, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("NosotrosClient.tsx updated with flat design.")
