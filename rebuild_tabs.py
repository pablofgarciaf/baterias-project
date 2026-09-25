import re

with open('src/components/admin/ContentEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the start of renderHeroTab
start_hero = "  const renderHeroTab = () => ("
# We'll replace everything from start_hero up to the END of the B2B mess that was injected.
# Wait, I injected it all inside renderHeroTab, and right after it is renderRecyclingTab.
# Let's find "const renderRecyclingTab"

match = re.search(r'  const renderHeroTab = \(\) => \(.*?(?=  const renderRecyclingTab)', content, flags=re.DOTALL)

if not match:
    print("Could not find renderHeroTab block")
else:
    tabs_replacement = """  const renderHeroTab = () => (
    <div className="space-y-6">
      {renderField('Texto de Badge', 'badgeText')}
      {renderField('TA-tulo Principal', 'titleMain')}
      {renderField('TA-tulo Resaltado', 'titleHighlight')}
      {renderField('SubtA-tulo', 'subtitle', 'textarea')}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderField('TA-tulo BotA3n Principal', 'ctaButtonText')}
        {renderField('TA-tulo BotA3n Secundario', 'secondaryButtonText')}
      </div>

      <div style={styles.card} className="p-5">
        <label style={styles.label}>Imagen de Fondo (Desktop)</label>
        <ImageUploader
          label="Hero Desktop"
          currentPreview={sectionDraft.backgroundImage}
          onFileSelect={(file) => handleImageSelect('backgroundImage', file)}
          onUrlChange={(url) => handleUrlChange('backgroundImage', url)}
        />
      </div>

      <div style={styles.card} className="p-5">
        <label style={styles.label}>Imagen de Fondo (Mobile)</label>
        <ImageUploader
          label="Hero Mobile"
          currentPreview={sectionDraft.mobileImage}
          onFileSelect={(file) => handleImageSelect('mobileImage', file)}
          onUrlChange={(url) => handleUrlChange('mobileImage', url)}
        />
      </div>

      <div style={styles.card} className="p-5">
        <label style={styles.label}>EstadA-sticas (3)</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              {renderField(`Stat ${i} Valor`, `stat${i}Value`)}
              {renderField(`Stat ${i} Label`, `stat${i}Label`)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAboutTab = () => (
    <div className="space-y-6">
      {renderField('Badge', 'badge')}
      {renderField('TA-tulo', 'title')}
      {renderField('PA!rrafo 1', 'paragraph1', 'textarea')}
      {renderField('PA!rrafo 2', 'paragraph2', 'textarea')}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderField('A?Aos (Badge)', 'yearsBadge')}
        {renderField('Subtexto AAos', 'yearsSubtext')}
      </div>

      <div style={styles.card} className="p-5">
        <label style={styles.label}>Imagen de Nosotros</label>
        <ImageUploader
          label="Nosotros"
          currentPreview={sectionDraft.aboutImage}
          onFileSelect={(file) => handleImageSelect('aboutImage', file)}
          onUrlChange={(url) => handleUrlChange('aboutImage', url)}
        />
      </div>

      <div style={styles.card} className="p-5">
        <label style={styles.label}>MisiA3n y VisiA3n</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            {renderField('TA-tulo MisiA3n', 'missionTitle')}
            {renderField('Texto MisiA3n', 'missionText', 'textarea')}
          </div>
          <div className="space-y-4">
            {renderField('TA-tulo VisiA3n', 'visionTitle')}
            {renderField('Texto VisiA3n', 'visionText', 'textarea')}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVehicleFinderTab = () => (
    <div className="space-y-6">
      {renderField('Badge', 'badge')}
      {renderField('TA-tulo', 'title')}
      {renderField('SubtA-tulo', 'subtitle', 'textarea')}
      {renderField('TA-tulo Ayuda TAcnica', 'technicalHelpTitle')}
      {renderField('SubtA-tulo Ayuda TAcnica', 'technicalHelpSubtitle')}
      {renderField('TA-tulo BotA3n WhatsApp', 'whatsappButtonText')}
    </div>
  );

  const renderStoreLocatorTab = () => (
    <div className="space-y-6">
      {renderField('Badge', 'badge')}
      {renderField('TA-tulo', 'title')}
      {renderField('SubtA-tulo', 'subtitle', 'textarea')}
      {renderField('Placeholder Buscador', 'searchPlaceholder')}
      {renderField('TA-tulo BotA3n WhatsApp', 'whatsappCtaText')}

      <div style={styles.card} className="p-5">
        <label style={styles.label}>Imagen Hero Agencias (Desktop)</label>
        <ImageUploader
          label="Hero Agencias Desktop"
          currentPreview={sectionDraft.heroDesktop}
          onFileSelect={(file) => handleImageSelect('heroDesktop', file)}
          onUrlChange={(url) => handleUrlChange('heroDesktop', url)}
        />
      </div>
      <div style={styles.card} className="p-5">
        <label style={styles.label}>Imagen Hero Agencias (Mobile)</label>
        <ImageUploader
          label="Hero Agencias Mobile"
          currentPreview={sectionDraft.heroMobile}
          onFileSelect={(file) => handleImageSelect('heroMobile', file)}
          onUrlChange={(url) => handleUrlChange('heroMobile', url)}
        />
      </div>
    </div>
  );

  const renderB2BTab = () => (
    <div className="space-y-6">
      {renderField('Badge', 'badge')}
      {renderField('TA-tulo B2B', 'title')}
      {renderField('SubtA-tulo', 'subtitle', 'textarea')}

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
            <div key={idx} className="p-4 rounded-xl" style={{ border: styles.border }}>
              <div className="flex justify-between gap-4 mb-3">
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => {
                    const newBenefits = [...(sectionDraft.benefits || [])];
                    if (newBenefits.length === 0) {
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
                  placeholder="TA-tulo del beneficio"
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
                placeholder="DescripciA3n del beneficio"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      {renderField('Texto BotA3n Enviar', 'submitButtonText')}
    </div>
  );

"""

    content = content[:match.start()] + tabs_replacement + content[match.end():]

    with open('src/components/admin/ContentEditor.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Successfully rebuilt tabs.")

