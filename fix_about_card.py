import re

with open('src/components/About.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

card_reg = r'<div\s+key=\{index\}\s+className=\{`p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0\.5 \$\{.*?\}\`\}\s*>'
card_rep = '''<motion.div 
                    initial={{opacity: 0, y: 15}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.4, delay: index * 0.1}}
                    key={index} 
                    className={`group p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.03] cursor-default ${
                      isDark 
                        ? 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 hover:bg-white/10' 
                        : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5'
                    }`}
                  >'''
content = re.sub(card_reg, card_rep, content, flags=re.DOTALL)

content = content.replace('</p>\n                </div>\n              ))}', '</p>\n                </motion.div>\n              ))}')

with open('src/components/About.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
