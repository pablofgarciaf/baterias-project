import os
import re

file_path = "src/app/(site)/nosotros/NosotrosClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the duplicate >
content = content.replace("hover:shadow-xl hover:-translate-y-1\"\n                >\n                >", "hover:shadow-xl hover:-translate-y-1\"\n                >")

# Fix the JSX closing mismatch on line 327.
# I had: content = content.replace("</div>\n              ))}\n            </div>", "</motion.div>\n              ))}\n            </div>")
# Let's check where the closing tag is wrong.
# Actually, the grid is mapping `values`. It used to be `<div key={i} ...` closed by `</div>`. I changed `<div` to `<motion.div`. Let's ensure it closes with `</motion.div>`.
# Wait, the error is at line 327. `))} ` "Expected '</', got ')'".
# Let's see line 326. `</motion.div>`. Line 327: `))} `.
# Maybe I replaced the WRONG `</div>`!
content = content.replace("</motion.div>\n              ))}\n            </div>", "</div>\n              ))}\n            </div>")
# The real Values grid ends around line 215. Let's fix it by regex for Values grid only.
grid_end_regex = r'\{\/\* Bottom Ribbon \*\/\}[\s\S]*?</div>\s*</div>\s*\)\)}\s*</div>'
grid_end_fixed = """{/* Bottom Ribbon */}
                  <div className={`h-3 w-full ${i % 2 === 0 ? 'bg-amber-500' : 'bg-primary-600'}`} />
                </motion.div>
              ))}
            </div>"""
content = re.sub(grid_end_regex, grid_end_fixed, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Syntax fixed.")
