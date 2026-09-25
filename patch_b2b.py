import re

with open('src/components/B2BLeadCapture.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

original_map = r'\[\s*\{\s*icon:\s*Percent.*?\]\.map\(\(item,\s*idx\)\s*=>\s*\(\s*<div\s*key=\{idx\}'
replacement = """
                (b2b.benefits && b2b.benefits.length > 0 ? b2b.benefits : [
                  { icon: Percent, title: b2b.benefit1Title, desc: b2b.benefit1Desc },
                  { icon: Truck, title: b2b.benefit2Title, desc: b2b.benefit2Desc },
                  { icon: PackageCheck, title: b2b.benefit3Title, desc: b2b.benefit3Desc },
                  { icon: FileSpreadsheet, title: b2b.benefit4Title, desc: b2b.benefit4Desc }
                ]).map((item: any, idx: number) => {
                  const ItemIcon = item.icon || [Percent, Truck, PackageCheck, FileSpreadsheet][idx % 4];
                  return (
                  <div 
                    key={idx} 
"""

content = re.sub(original_map, replacement, content, flags=re.DOTALL)

icon_render = r'<item\.icon className="w-4 h-4" />'
content = re.sub(icon_render, '<ItemIcon className="w-4 h-4" />', content)

content = content.replace('))}</div>', ')}</div>')
content = content.replace('))}            </div>', ')}            </div>')
content = content.replace('))}              </div>', ')}              </div>')

with open('src/components/B2BLeadCapture.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
