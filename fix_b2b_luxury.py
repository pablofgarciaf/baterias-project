import re

with open('src/components/B2BLeadCapture.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the left column a motion div
content = content.replace(
    '<div className="lg:col-span-5">',
    '<motion.div initial={{opacity: 0, filter: "blur(10px)", x: -20}} whileInView={{opacity: 1, filter: "blur(0px)", x: 0}} viewport={{once: true}} transition={{duration: 0.6}} className="lg:col-span-5">'
)

content = content.replace(
    '</p>\n\n              <div className="mt-8 space-y-4">',
    '</p>\n\n              <div className="mt-8 space-y-3">'
)

# Convert the mapped items into motion divs with luxury styling
# Currently it looks like:
#                   <div 
#                     key={idx} 
#                     className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
#                       isDark 
#                         ? 'bg-slate-900/60 border-slate-800 text-white' 
#                         : 'bg-white border-slate-100 text-slate-900 hover:shadow-lg hover:shadow-slate-200/50'
#                     }`}
#                   >

luxury_card_regex = r'<div\s+key=\{idx\}\s+className=\{`flex items-start gap-3\.5 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0\.5 \$\{.*?\}\`\}\s*>'

luxury_card_replacement = '''<motion.div 
                    initial={{opacity: 0, y: 15}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.4, delay: idx * 0.1}}
                    key={idx} 
                    className={`group flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-default ${
                      isDark 
                        ? 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 hover:bg-white/10' 
                        : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5'
                    }`}
                  >'''

content = re.sub(luxury_card_regex, luxury_card_replacement, content, flags=re.DOTALL)

# Adjust the inner icon wrapper of the card to glow on hover
icon_wrapper_regex = r'<div className="p-2\.5 rounded-xl bg-blue-600/15 text-blue-600 dark:text-blue-400 shrink-0">'
icon_wrapper_replacement = '<div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-white/10 dark:text-white shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">'
content = re.sub(icon_wrapper_regex, icon_wrapper_replacement, content)

# Close the motion div for the cards (replaces the closing div of the map)
# The old script did: content.replace('))}            </div>', '); })}            </div>')
# Wait, if we change `<div key={idx}` to `<motion.div key={idx}`, we must change the closing tag.
content = content.replace(
    '</p>\n                  </div>\n                </div>\n  );\n                })}\n              </div>',
    '</p>\n                  </div>\n                </motion.div>\n  );\n                })}\n              </div>'
)

# Also wrap the right column (form) in a motion div
right_column_regex = r'<div className="lg:col-span-7">\s*<div className=\{`rounded-2xl p-5 sm:p-6 shadow-2xl border transition-colors \$\{\s*isDark\s*\?\s*\'bg-slate-900/90 border-slate-700 text-white\'\s*:\s*\'bg-white border-slate-200 text-slate-900 shadow-slate-900/10\'\s*\}\`\}>'

right_column_replacement = '''<motion.div 
            initial={{opacity: 0, filter: "blur(10px)", x: 20}} 
            whileInView={{opacity: 1, filter: "blur(0px)", x: 0}} 
            viewport={{once: true}} 
            transition={{duration: 0.6, delay: 0.2}} 
            className="lg:col-span-7"
          >
            <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl border backdrop-blur-xl transition-colors ${
              isDark 
                ? 'bg-slate-900/50 border-white/10 text-white' 
                : 'bg-white/80 border-slate-200 text-slate-900 shadow-slate-900/10'
            }`}>'''

content = re.sub(right_column_regex, right_column_replacement, content, flags=re.DOTALL)

# Close the right column motion div
content = content.replace(
    '</form>\n              )}\n\n            </div>\n          </div>',
    '</form>\n              )}\n\n            </div>\n          </motion.div>'
)

with open('src/components/B2BLeadCapture.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
