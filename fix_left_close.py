with open('src/components/B2BLeadCapture.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '              </div>\n          </div>\n\n          {/* Right Column: Lead Form */}',
    '              </div>\n          </motion.div>\n\n          {/* Right Column: Lead Form */}'
)

with open('src/components/B2BLeadCapture.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
