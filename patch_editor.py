import re

with open('src/components/admin/ContentEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the 4 hardcoded B2B cards with a dynamic array editor
original_b2b = r'<div className="grid grid-cols-1 md:grid-cols-2 gap-6">.*?</div>\s*</div>\s*\{renderField\(\'Texto Botón Enviar'
replacement = """
      <div style={styles.card} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <label style={styles.label}>Beneficios B2B</label>
          <button
            onClick={() => {
              const current = sectionDraft.benefits || [
                { title: sectionDraft.benefit1Title || '', desc: sectionDraft.benefit1Desc || '' },
                { title: sectionDraft.benefit2Title || '', desc: sectionDraft.benefit2Desc || '' },
                { title: sectionDraft.benefit3Title || '', desc: sectionDraft.benefit3Desc || '' },
                { title: sectionDraft.benefit4Title || '', desc: sectionDraft.benefit4Desc || '' }
              ].filter((b: any) => b.title);
              handleDraftChange({ benefits: [...current, { title: 'Nuevo Beneficio', desc: '' }] });
            }}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar Beneficio
          </button>
        </div>
        <div className="space-y-4">
          {(sectionDraft.benefits || [
            { title: sectionDraft.benefit1Title || '', desc: sectionDraft.benefit1Desc || '' },
            { title: sectionDraft.benefit2Title || '', desc: sectionDraft.benefit2Desc || '' },
            { title: sectionDraft.benefit3Title || '', desc: sectionDraft.benefit3Desc || '' },
            { title: sectionDraft.benefit4Title || '', desc: sectionDraft.benefit4Desc || '' }
          ].filter((b: any) => b.title)).map((benefit: any, idx: number) => (
            <div key={idx} className="p-4 border rounded-xl" style={{ borderColor: styles.borderColor }}>
              <div className="flex justify-between gap-4 mb-3">
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => {
                    const newBenefits = [...(sectionDraft.benefits || [])];
                    if (newBenefits.length === 0) {
                      // Migrate if not yet in state
                      newBenefits.push(
                        { title: sectionDraft.benefit1Title || '', desc: sectionDraft.benefit1Desc || '' },
                        { title: sectionDraft.benefit2Title || '', desc: sectionDraft.benefit2Desc || '' },
                        { title: sectionDraft.benefit3Title || '', desc: sectionDraft.benefit3Desc || '' },
                        { title: sectionDraft.benefit4Title || '', desc: sectionDraft.benefit4Desc || '' }
                      );
                    }
                    newBenefits[idx].title = e.target.value;
                    handleDraftChange({ benefits: newBenefits });
                  }}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={styles.input}
                  placeholder="Título del beneficio"
                />
                <button
                  onClick={() => {
                    const newBenefits = [...(sectionDraft.benefits || [])].filter((_, i) => i !== idx);
                    handleDraftChange({ benefits: newBenefits });
                  }}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={benefit.desc}
                onChange={(e) => {
                  const newBenefits = [...(sectionDraft.benefits || [])];
                  newBenefits[idx].desc = e.target.value;
                  handleDraftChange({ benefits: newBenefits });
                }}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{...styles.textarea, minHeight: '60px'}}
                placeholder="Descripción del beneficio"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      {renderField('Texto Botón Enviar'
"""

content = re.sub(original_b2b, replacement, content, flags=re.DOTALL)

with open('src/components/admin/ContentEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
