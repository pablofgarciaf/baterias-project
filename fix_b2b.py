with open('src/components/B2BLeadCapture.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(r'\}\)\s*\}\s*\)\s*</div>', '  );\n                })}\n              </div>', content)
content = re.sub(r'\}\)\s*\)\s*</div>', '  );\n                })}\n              </div>', content)
content = re.sub(r'\)\)\}\s*</div>', '  );\n                })}\n              </div>', content)

with open('src/components/B2BLeadCapture.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
