import os
import re

file_path = "src/components/Blog.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace track
track_old = r'<div\s+className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none -mx-4 px-4 sm:mx-0 sm:px-0"[\s\S]*?onTouchStart=\{handleTouchStart\}[\s\S]*?onTouchMove=\{handleTouchMove\}[\s\S]*?onTouchEnd=\{handleTouchEnd\}[\s\S]*?>\s*<div\s+className="flex transition-transform duration-500 ease-out"\s+style=\{\{[\s\S]*?\}\}\s*>\s*\{filteredPosts\.map\(\(post, i\) => \(\s*<div\s+key=\{post\.id\}\s+className="px-3 shrink-0"\s+style=\{\{ width: `\$\{100 / itemsPerView\}%` \}\}\s*>'

track_new = """<div 
            id="blog-carousel-track"
            className="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-4 gap-6 -mx-4 px-4 sm:-mx-8 sm:px-8 no-scrollbar scroll-smooth"
          >
          {filteredPosts.map((post, i) => (
              <div 
                key={post.id} 
                className="shrink-0 snap-center w-[280px] sm:w-[320px] md:w-[350px]"
              >"""

content = re.sub(track_old, track_new, content)

# 2. Replace JS logic
js_logic_old = r'const handlePrev = \(\) => \{[\s\S]*?setCurrentIndex\(prev => \(prev <= 0 \? maxIndex : prev - 1\)\);[\s\S]*?\};[\s\S]*?const handleNext = \(\) => \{[\s\S]*?setCurrentIndex\(prev => \(prev >= maxIndex \? 0 : prev \+ 1\)\);[\s\S]*?\};'

js_logic_new = """const handlePrev = () => {
    const track = document.getElementById('blog-carousel-track');
    if (track) {
      track.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    const track = document.getElementById('blog-carousel-track');
    if (track) {
      track.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };"""

content = re.sub(js_logic_old, js_logic_new, content)

# Remove dots block
dots_regex = r'\{\/\* Carousel Indicators / Dots \*\/\}.*?</div>\s*</div>'
content = re.sub(dots_regex, '</div>', content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Blog updated.")
