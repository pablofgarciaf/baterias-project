import os
import re

file_path = "src/components/Products.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will rewrite the Carousel section in Products.tsx
# The track is wrapped in `<div className="relative overflow-hidden cursor-grab ...`
# Let's replace the whole track logic.

# Instead of regex, I'll just replace the specific track block

track_old = r'<div\s+className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none -mx-4 px-4 sm:mx-0 sm:px-0"[\s\S]*?onTouchStart=\{handleTouchStart\}[\s\S]*?onTouchMove=\{handleTouchMove\}[\s\S]*?onTouchEnd=\{handleTouchEnd\}[\s\S]*?>\s*<div\s+className="flex transition-transform duration-500 ease-out"\s+style=\{\{[\s\S]*?\}\}\s*>\s*\{filteredItems\.map\(\(item\) => \{\s*const IconComp = item\.icon;\s*return \(\s*<div\s+key=\{item\.id\}\s+className="px-3 shrink-0"\s+style=\{\{ width: `\$\{100 / itemsPerView\}%` \}\}\s*>'

track_new = """<div 
            id="products-carousel-track"
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 -mx-4 px-4 sm:mx-0 sm:px-2 no-scrollbar scroll-smooth"
          >
            {filteredItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="shrink-0 snap-center w-[300px] sm:w-[340px] md:w-[360px]"
                >"""

content = re.sub(track_old, track_new, content)

# I need to change how handleNext and handlePrev work.
# They should just scroll the #products-carousel-track by clientWidth

js_logic_old = r'const handlePrev = \(\) => \{[\s\S]*?setDirection\(-1\);[\s\S]*?\};[\s\S]*?const handleNext = \(\) => \{[\s\S]*?setDirection\(1\);[\s\S]*?\};'

js_logic_new = """const handlePrev = () => {
    const track = document.getElementById('products-carousel-track');
    if (track) {
      track.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    const track = document.getElementById('products-carousel-track');
    if (track) {
      track.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };"""

content = re.sub(js_logic_old, js_logic_new, content)

# Remove the dots completely or keep them as decorative?
# "Tiene un efecto estupido que regresa..." -> I'll remove the dynamic dots that rely on currentIndex, or just keep them static.
# Actually I'll remove the indicators block to simplify since they scroll natively now.
dots_regex = r'\{\/\* Carousel Indicators / Dots \*\/\}.*?</div>\s*</div>'
content = re.sub(dots_regex, '</div>', content, flags=re.DOTALL)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Products.tsx carousel rewritten with CSS Snap.")
