with open('src/components/B2BLeadCapture.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Look at lines around 162
# It says:
#                   </div>
#                 </div>
#                 );
#                 })}
#
# But the opening tag is <motion.div key={idx}...
# So it should be </motion.div> not </div>
# And we changed it to </motion.div> earlier!
# Let's completely rewrite the map block robustly.

map_regex = r'\{\s*\(\s*b2b\.benefits.*?\}\)\s*\}\s*</div>'

# Wait, let's just do a simple replacement
content = content.replace(
    '''                  </div>
                </div>
                );
                })}
              </div>''',
    '''                  </div>
                </motion.div>
                );
                })}
              </div>'''
)

with open('src/components/B2BLeadCapture.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
