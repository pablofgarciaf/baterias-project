import re

with open('src/components/About.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make left image column animate with luxury blur
left_col = r'<div className="relative">'
left_col_rep = '<motion.div initial={{opacity: 0, x: -20, filter: "blur(10px)"}} whileInView={{opacity: 1, x: 0, filter: "blur(0px)"}} viewport={{once: true}} transition={{duration: 0.7}} className="relative">'
content = content.replace(left_col, left_col_rep)
content = content.replace('</div>\n\n          {/* Right Column:', '</motion.div>\n\n          {/* Right Column:')

# Right column text and grid
right_col = r'<div className="lg:pl-8 xl:pl-12">'
right_col_rep = '<motion.div initial={{opacity: 0, x: 20, filter: "blur(10px)"}} whileInView={{opacity: 1, x: 0, filter: "blur(0px)"}} viewport={{once: true}} transition={{duration: 0.7, delay: 0.2}} className="lg:pl-8 xl:pl-12">'
content = content.replace(right_col, right_col_rep)
content = content.replace('</div>\n\n        </div>\n      </div>\n    </section>', '</motion.div>\n\n        </div>\n      </div>\n    </section>')

# Luxury typography
content = content.replace('text-3xl sm:text-4xl lg:text-5xl font-bold', 'text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter')
content = content.replace('text-base sm:text-lg leading-relaxed', 'text-lg sm:text-xl leading-relaxed tracking-tight')

# Card luxury
card_reg = r'<div\s+key=\{idx\}\s+className=\{`p-5 sm:p-6 rounded-2xl border transition-all hover:-translate-y-1 \$\{.*?\}\`\}\s*>'
card_rep = '''<motion.div 
                    initial={{opacity: 0, y: 15}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.4, delay: idx * 0.1}}
                    key={idx} 
                    className={`group p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.03] cursor-default ${
                      isDark 
                        ? 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 hover:bg-white/10' 
                        : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5'
                    }`}
                  >'''
content = re.sub(card_reg, card_rep, content, flags=re.DOTALL)
content = content.replace('</p>\n                  </div>\n                ))}</div>', '</p>\n                  </motion.div>\n                ))}</div>')

with open('src/components/About.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
