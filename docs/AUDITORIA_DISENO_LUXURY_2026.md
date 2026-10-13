# 🎨 AUDITORÍA INTEGRAL DE DISEÑO UI/UX — BATERÍAS MARESA
**Fecha:** 12 de Octubre, 2026  
**Estándar Aplicado:** `agency-ui-designer` + `UI Finish-Gate Reviewer` + `Emil Kowalski Design Engineering` + `Apple Luxury Standards` (`DESIGN_LUXURY.md`)  
**Veredicto General Pre-Ship:** 🧱 **HOLD (NECESITA ELEVACIÓN URGENTE A NIVEL DE CLASE MUNDIAL)**

---

## 1. Diagnóstico Ejecutivo: ¿Por qué la app se siente genérica y no como "la mejor del mundo"?

Actualmente la plataforma tiene una base funcional robusta (filtros, mapas, Firebase, Next.js 15), pero a nivel visual y de experiencia comete los **4 pecados capitales de interfaces corporativas genéricas**:

1. **Síndrome de "Dashboard / Plantilla Bootstrap/Tailwind 2021":**
   - Uso indiscriminado de cajas con bordes saturados (`border-blue-500/30`, `bg-amber-500/15`, `bg-blue-600`), gradientes de colores primarios muy ruidosos (`from-blue-600 to-indigo-600`) y tarjetas con sombras default.
   - Textos con etiquetas defensivas ("Nombre comercial provisional", "Información comercial sujeta a confirmación") repetidas por todos lados que destruyen la autoridad visual de una marca como Corporación Maresa.

2. **Ruptura de la Jerarquía Tipográfica y Espaciado Editorial:**
   - La tipografía carece del dramatismo de una marca de ingeniería automotriz de lujo. En marcas de élite (Porsche, Tesla, Apple, Rimac), el espacio en blanco (*whitespace*) del 12-16% es el protagonista.
   - En la home y páginas secundarias los elementos están amontonados en contenedores con paddings tímidos (`py-16`, `gap-4`).

3. **Inconsistencia de Tokens de Color y "Colores Vulgares":**
   - Violación directa de la regla 5 de Luxury Design: colores súper saturados conviven juntos (amarillo ámbar, azul eléctrico, verde esmeralda brillante, naranja). Se siente como una feria de badges y no como un sistema sobrio de alta gama (Titanio, Obsidiana, Carbono, Grafito y un único acento refinado Azul Cobalto Eléctrico o Platino).

4. **Microinteracciones y Acabado Háptico Incompleto:**
   - Mientras el selector de vehículos (`VehicleFinder`) avanzó hacia Emil Kowalski, el resto de la aplicación (Header, Teaser Cards en Home, Productos, Nosotros, Blog, Modales) aún utiliza botones rígidos, cards estáticas sin elevación ni profundidad háptica, y transiciones sin física natural de resortes (*spring curves*).

---

## 2. Radiografía Quirúrgica Sección por Sección

### A. Header & Navegación Global
* **Estado Actual:** Barra con blur básico, menú desplegable con bordes estándar y marquee superior que compite visualmente con el logo.
* **Problema UI:** Falta la ligereza de una barra flotante tipo *Dynamic Island / Glass Capsule*. El botón "Ser Proveedor" y el selector de tema parecen añadidos sin alineación geométrica milimétrica.
* **Prescripción de Diseño:**
  - Convertir el Header en una cápsula suspendida de cristal esmerilado (`backdrop-blur-2xl bg-black/40 border border-white/10 rounded-full mx-auto max-w-6xl mt-4`).
  - Navegación con indicador activo por deslizamiento magnético (*framer-motion layoutId="activeTab"*).

### B. Hero Section (El Byte 0 del Impacto Visual)
* **Estado Actual:** Imagen de fondo estática, gradiente negro a la izquierda y tipografía estándar con un botón azul convencional.
* **Problema UI:** No transmite potencia, precisión ni lujo tecnológico.
* **Prescripción de Diseño:**
  - Tipografía cinematográfica de gran escala con tracking ultra-tight (`tracking-[-0.04em]`).
  - Iluminación ambiental reactiva: efecto de haz de luz cinemático (Spotlight beam) que proyecta un brillo metálico sobre la tipografía.
  - Métricas flotantes en tarjetas de titanio cepillado con cristal oscuro.

### C. Selector de Baterías (`VehicleFinder`)
* **Estado Actual:** Tiene buen avance técnico y custom dropdowns, pero el bloque de resultados es pesado y sobrecargado de bordes.
* **Problema UI:** Falta la sensación de "Bento Grid de Alta Precisión" donde cada especificación (CCA, Amperaje, Polaridad, Medidas BCI) parece tallada en un bloque de hardware automotriz.
* **Prescripción de Diseño:**
  - Bento Grid minimalista inspirado en Apple Spec Sheets.
  - Indicadores con tipografía monoespaciada de alta precisión (`JetBrains Mono` o `Geist Mono`) para números y amperajes.
  - Renderizado 3D/isométrico o silueta de batería con efecto de transparencia de rayos X (X-ray battery cutaway) al seleccionar el vehículo.

### D. Directorio de Agencias y Mapa (`/agencias`)
* **Estado Actual:** Mapa con controles estándar y lista de cards que colapsan en scroll largo.
* **Problema UI:** Las tarjetas de agencias tienen badges colorinches y los botones de acción no tienen jerarquía clara.
* **Prescripción de Diseño:**
  - Panel lateral de agencias con textura de cabina de comando (Command Center).
  - Marcadores en mapa con pulso de radar cinemático (sonar pulse).
  - Estado de agencia seleccionada con borde de gradiente metálico fluido.

### E. Catálogo de Productos y Tarjetas Educativas (`/productos`)
* **Estado Actual:** Cards que dicen "Por validar" y "0 CCA", lo que visualmente luce como un prototipo en construcción o abandonado.
* **Problema UI:** Destruye la credibilidad. Si son tecnologías de referencia, deben presentarse como "Fichas de Ingeniería de Vanguardia" (AGM Long-Life, EFB Start-Stop Tech, Calcio-Plata Dual Matrix), no con valores en cero.
* **Prescripción de Diseño:**
  - Rediseñar como especificaciones técnicas de vanguardia automotriz.
  - Tarjetas con acabado mate profundo, reflejos especulares al hover y modales de especificación con diagramas vectoriales limpios.

### F. Footer
* **Estado Actual:** Footer genérico de 4 columnas en gris oscuro con avisos legales defensivos.
* **Problema UI:** Desconexión con el resto de la experiencia.
* **Prescripción de Diseño:**
  - Footer monolítico editorial, tipografía de marca a gran escala de fondo (watermark tipográfico "MARESA"), links con espaciado generoso y sellos de garantía estilizados en relieve de cristal.

---

## 3. Plan Maestro de Elevación: "De Genérica a Magnífica A+"

| Fase | Componente / Área | Transformación Clave |
| :--- | :--- | :--- |
| **Fase 1** | **Sistema de Tokens & Paleta (Globals)** | Erradicar colores ruidosos. Establecer paleta: Obsidiana (#080B11), Grafito (#111726), Blanco Cerámico, y acentos Metálicos Platino y Cobalto Pulido. |
| **Fase 2** | **Header Flotante & Nav** | Cápsula de ultra-lujo flotante con glassmorphism de 40px blur, borde sutil 1px white/10 y switchers refinados. |
| **Fase 3** | **Hero Cinematográfico** | Rediseño de impacto con micro-interacciones, tipografía display monumental y tarjeta de especificaciones en vidrio templado. |
| **Fase 4** | **VehicleFinder Bento Sheet** | Rediseño del resultado de compatibilidad en un Bento Grid de hardware de precisión. |
| **Fase 5** | **Showcase de Productos & Agencias** | Transformar tarjetas genéricas en piezas de ingeniería con iluminación sutil al cursor (Spotlight Card effect). |
| **Fase 6** | **Micro-interacciones Emil Kowalski** | Física `[0.23, 1, 0.32, 1]` en todos los botones, active:scale-95, feedback sonoro/háptico visual en clics y transiciones de página fluidas. |
