<!-- estado: "" -->
# Auditoría de diseño y plan de renovación — Baterías Maresa

**Fecha:** 13 de octubre de 2026  
**Alcance:** exclusivamente identidad visual, interfaz, jerarquía, composición, respuesta móvil y estados de presentación del sitio público. El panel administrativo queda inventariado como fase separada.  
**Evidencia:** código de esta copia, recursos de `public/` y revisión de la compilación local en escritorio (1265 px) y móvil (390 × 844 px). Se observaron inicio, catálogo, agencias y contacto B2B en modo claro. No se midieron usuarios reales ni se aprobó una marca oficial.

## Veredicto

La línea de base parecía una maqueta de varias marcas: un icono temporal azul con letras `MBT`, un sistema global azul/ámbar/verde, acentos nuevos por sección e imágenes con rótulos ficticios. La migración cromática descrita al final de este documento ya resuelve parte de esa dispersión, pero todavía faltan el logotipo autorizado, la fotografía correcta y una estructura de componentes coherente.

**Corrección de marca (13 de octubre):** la guía digital reconstruida que asignó azul `#0A2240` y rojo `#D31145` fue rechazada por el propietario. Esos valores no deben describirse ni usarse como colores de Maresa. En la [web actual de Maresa Center](https://www.maresacenter.com/) —red de comercialización de [Corporación Maresa](https://www.maresacenter.com/nosotros)— se observa naranja `rgb(247,148,29)` (`#F7941D`) en elementos de interfaz y un logotipo naranja sobre neutros grises. Esto es evidencia visual de su presencia digital, no un manual corporativo ni una autorización de logotipo. El nombre “Baterías Maresa” sigue marcado como provisional.

## Hallazgos priorizados de la línea de base

La tabla recoge lo observado antes de aplicar la nueva paleta. El avance posterior se registra al final; conservar la evidencia original permite comprobar qué se corrigió y qué sigue abierto.

| ID | Prioridad | Hallazgo y evidencia | Efecto visual | Corrección y criterio de cierre |
| --- | --- | --- | --- | --- |
| D01 | Crítica | `src/app/globals.css` definía `primary` azul, `secondary` ámbar y `accent` verde; `public/icon.svg` era un cuadro azul con “MBT”; `Header.tsx` y `Footer.tsx` usan una batería Lucide como marca. | No hay firma visual propia ni una versión consistente del identificador. | Aplicar naranja y neutros observados en Maresa Center; reemplazar el icono temporal por recursos autorizados; comprobar encabezado, favicon y pie en fondos claro y oscuro. |
| D02 | Alta | Se localizaron utilidades de azul, verde, ámbar, cian, violeta y otros acentos directos en 29 componentes TSX. La portada añade gradientes distintos a cada tarjeta (`src/app/(site)/page.tsx`). | Cambiar tokens globales dejaría franjas y botones con colores antiguos. | Migrar por roles semánticos y después retirar los colores directos del sitio público. Una búsqueda de clases antiguas debe quedar sin casos visuales sin justificar. |
| D03 | Alta | `public/hero-desktop.webp` incluye una batería rotulada “Energía Andina”; `hero-mobile.webp` muestra texto generado dentro de la foto. `quienes-somos-hero-desktop.webp` y `hero-agencias-desktop.webp` usan otra estética y contienen rótulos que aparentan datos. | La dirección de arte contradice la marca y las imágenes no son fiables como piezas de producto. | Sustituir por fotografía autorizada sin letras integradas; poner todo el texto en HTML; definir encuadres por escritorio y móvil; revisar legibilidad del titular sin oscurecer la imagen en exceso. |
| D04 | Alta | El inicio combina marquesina superior, menú transparente, texto sobre foto, tres estadísticas y una segunda banda inferior. `Hero.tsx` usa rótulos de 10–11 px y `Header.tsx` una segunda línea de 9 px. | Las piezas compiten por atención y la lectura secundaria se vuelve diminuta. | Un único mensaje principal, un CTA primario y uno secundario; retirar o simplificar las bandas; escala tipográfica que no dependa de microtexto para comunicar información útil. |
| D05 | Alta | El catálogo muestra “Ficha comercial pendiente” en verde sobre tarjetas y sigue usando aspecto de producto vendible; en `Products.tsx` hay campos con `0` y “Por validar”. | El verde sugiere confirmación mientras el contenido declara que falta verificarlo. | Diferenciar “guía de tecnología” de “producto publicado”; estado pendiente en un tono neutral, sin medallas de éxito; no renderizar especificaciones ficticias como si fueran fichas. |
| D06 | Alta | Con cero agencias publicadas, `/agencias` conserva un panel grande de mapa vacío y el botón “Agencia más cercana (GPS)”; la captura móvil y la de escritorio muestran un estado vacío perdido dentro de un diseño de buscador activo. | Mucho espacio sin contenido y una acción que no puede producir un resultado útil. | Diseñar una pantalla vacía específica: explicación breve, filtros desactivados o sustituidos por información útil, sin mapa/GPS hasta que exista una agencia publicada. |
| D07 | Media | En `/contacto-b2b` el aviso indica que el formulario está en preparación, pero todos los campos se ven como una solicitud lista para completar y el botón ocupa todo el ancho. | El usuario puede invertir tiempo en rellenar datos que no se enviarán. | Cuando el canal esté cerrado, mostrar un bloque informativo claro en vez de un formulario aparentemente activo; al habilitarlo, introducir de nuevo los campos y sus estados. |
| D08 | Media | La portada, catálogo, agencias y contacto usan encabezados, badges, tarjetas, radios y sombras distintos. `Products.tsx`, `VehicleFinder.tsx`, `B2BLeadCapture.tsx` y `AgenciasClient.tsx` repiten decisiones visuales directamente. | Se siente como varias plantillas unidas. | Crear primitivas compartidas para sección, encabezado, botón, estado, tarjeta, campo y etiqueta; fijar densidad, bordes, radios y elevación por token. |
| D09 | Media | Hay entradas con desenfoque y movimiento en varias pantallas. El CSS global contempla `prefers-reduced-motion`, pero las animaciones de componentes necesitan una revisión visual específica. | La primera lectura puede verse borrosa y lenta; la adaptación a movimiento reducido no está demostrada para todos los componentes. | Reducir animaciones a transiciones con función clara; comprobar carga, navegación y carruseles con movimiento reducido y sin depender del efecto para revelar contenido. |
| D10 | Media | La pastilla fija “Privacidad y medición” aparece encima del contenido en las capturas móviles. | Se superpone a botones y texto en pantallas estrechas. | Reservar espacio seguro y reubicar el acceso persistente; validar que no cubra controles en 360–430 px. |

## Dirección visual propuesta

**Personalidad:** ingeniería automotriz clara, confianza y precisión. Evitar el estilo de panel futurista, las luces de neón, el vidrio en todas las superficies y las tarjetas “premium” que compiten con el contenido. La calidad debe venir de la fotografía correcta, los datos legibles, la tipografía y una composición disciplinada.

**Jerarquía:** una sola idea principal por pantalla. Encabezado compacto; títulos con buen aire; descripción breve; acción primaria evidente; acciones secundarias discretas. Las fichas técnicas deben favorecer lectura y comparación, no efectos visuales.

**Fotografía:** producto real y escenas autorizadas. Crear una guía de encuadres: batería o vehículo con espacio negativo para el texto, fondo que soporte contraste y variantes móvil/escritorio. No incrustar afirmaciones, logotipos o pseudoetiquetas dentro de fotografías generadas.

**Tipografía:** Montserrat para títulos y Open Sans para lectura, según la guía entregada. Establecer cuerpo base de 16 px, metadatos normalmente de 12–14 px, alturas de línea generosas y un máximo de dos pesos dominantes por bloque. Los números técnicos pueden usar cifras tabulares; no hace falta introducir una tercera familia solo por estética.

## Sistema cromático corregido

| Rol | Valor de trabajo | Procedencia y uso |
| --- | --- | --- |
| Naranja visible de Maresa Center | `#F7941D` | Valor calculado de la interfaz actual; CTA, selección y detalles. No se declara HEX oficial corporativo. |
| Carbón | `#2C2C2C` | Neutro propuesto para títulos, navegación e iconos; no se presenta como color de marca certificado. |
| Texto | `#4A4A4A` | Párrafos y datos sobre fondo claro. |
| Fondo cálido | `#F6F6F4` | Descanso visual sin tinte azul. |
| Blanco | `#FFFFFF` | Superficies, formularios y fondo de navegación. |
| Borde | `#E4E4DF` | Separadores discretos. |
| Noche | `#191919` | Modo oscuro y capas fotográficas. |

**Regla de aplicación:** superficies blancas y grises predominantes; naranja en CTA y señales de interacción. Los estados de error o éxito conservan color semántico solo donde informan un resultado real. El texto de botones naranja es carbón porque blanco sobre `#F7941D` no ofrece contraste suficiente para texto pequeño. El mapa usa neutros y sus controles se ajustan a la misma familia.

`src/app/globals.css` centraliza los tokens. `primary` y `accent` son escalas neutras; `secondary` es la escala naranja. Los nombres históricos `brand-navy` y `brand-red` permanecen como alias técnicos de compatibilidad y apuntan ya a carbón y naranja. Deben renombrarse al consolidar componentes para evitar volver a interpretar esos nombres como identidad.

Como criterio de aceptación se comprobará contraste de texto normal **4.5:1**, texto grande **3:1** y elementos de interfaz relevantes **3:1**, según [WCAG 2.2 del W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y su [criterio de contraste no textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast). Se medirán los colores finales sobre sus fondos reales, incluidas fotografías y estados hover/focus.

## Plan de ejecución por fases

### Fase 0 — Referencia y línea de base

1. Registrar que la guía digital reconstruida fue rechazada; confirmar con la empresa si el sitio representa a Corporación Maresa, a una marca de baterías del grupo o a una guía provisional.
2. Solicitar el logotipo vectorial autorizado y sus variantes positiva/negativa. Confirmar el área de respeto y los usos sobre fotografías; el naranja observado en Maresa Center requiere cotejo con la marca específica de este proyecto antes de publicación oficial.
3. Congelar capturas comparables de inicio, catálogo, buscador, agencias, nosotros, reciclaje, blog y contacto en 390 y 1440 px; repetir en tema claro y oscuro.
4. Hacer inventario de imágenes locales y remotas; marcar cada una como aprobada, provisional o descartada. La identidad corporativa no se deducirá de imágenes generadas.

**Entrega:** breve ficha de marca verificable y tablero de capturas “antes”. **Cierre:** el propietario puede señalar qué recurso autorizó cada color y logotipo.

### Fase 1 — Fundamentos y migración cromática

1. Definir tokens de marca, superficies, texto, bordes, foco y estados en `globals.css`; mantener nombres independientes del color concreto.
2. Construir una página o archivo de muestra con botones, enlaces, badges, tarjetas, campos, avisos y estados vacíos en claro y oscuro.
3. Migrar primero `Header`, `Footer`, `Hero`, botones y componentes de formulario; después las secciones de la portada y las rutas internas.
4. Reemplazar gradientes decorativos no justificados por superficies neutras; reservar el acento para CTA, enlaces, selección y una cantidad pequeña de detalles.
5. Auditar referencias directas a azul/verde/ámbar y excepciones necesarias (p. ej. estados semánticos o mapas), con una lista explícita.

**Entrega:** tokens y componentes base. **Cierre:** no quedan colores de marca antiguos visibles en las ocho rutas públicas; claro y oscuro mantienen contraste.

### Fase 2 — Identidad y estructura global

1. Sustituir el pictograma genérico por versiones aprobadas del logotipo; el favicon ya se convirtió en un símbolo neutro de batería sin pretensión de ser marca oficial.
2. Redibujar navegación con agrupación estable, espaciado y estados activos. Revisar “Más” en escritorio y menú móvil sin ocultar la acción principal.
3. Reducir la marquesina a información realmente necesaria o retirarla; evitar dos cintas simultáneas en la primera pantalla.
4. Unificar el pie: marca, navegación útil, contacto solo si está confirmado y notas editoriales discretas pero legibles.
5. Definir escala de espacios (8/12/16/24/32/48/64), ancho de lectura y alturas de botones; tratar móvil como composición propia, no como reducción automática.

**Entrega:** cabecera, pie y estructura de sección reutilizables. **Cierre:** una persona identifica la marca y encuentra catálogo, buscador, puntos y contacto sin depender de “Más”.

### Fase 3 — Portada y dirección de arte

1. Usar las dos imágenes generadas sin letras ni marcas como reemplazos provisionales del hero; sustituirlas por fotografías autorizadas cuando existan. Revisar versión móvil con el sujeto y el titular en zonas separadas.
2. Ajustar altura y posición del hero para que titular, resumen y CTA sean visibles y legibles a 390 × 844 px tras terminar la animación de carga.
3. Mantener un CTA primario claro; el secundario no debe parecer idéntico. Eliminar las tres estadísticas si no aportan decisión útil o carecen de datos oficiales.
4. Reordenar los bloques: elección de batería → explicación de tecnología → puntos de atención → relación comercial. Evitar repetir el mismo mensaje técnico en cuatro secciones.
5. Sustituir tarjetas de cuatro colores por una plantilla común con imagen o icono medido, texto y una acción.

**Entrega:** portada coherente. **Cierre:** prueba de 5 segundos: marca, oferta de información y acción principal se comprenden sin desplazamiento en escritorio y móvil.

### Fase 4 — Plantillas internas y estados

1. **Catálogo:** separar guías de tecnologías de productos comerciales. Tarjetas comparables, etiquetas neutrales para datos pendientes y ficha técnica solo para referencias verificadas.
2. **Buscador:** una pantalla vacía didáctica cuando no hay catálogo; pasos cortos, progreso claro y resultado con ficha comprobable cuando se habilite.
3. **Agencias:** primero estado vacío útil. Con datos publicados, lista y mapa coordinados, misma ficha seleccionada, controles de filtro que realmente den resultados.
4. **Nosotros y reciclaje:** sustituir imágenes o afirmaciones de marca no aprobadas; jerarquía editorial más serena y llamadas a la acción acordes con información disponible.
5. **Blog:** portada y tarjetas de lectura con una misma retícula; diferenciar categoría, título y resumen sin usar un color distinto por artículo.
6. **Contacto B2B:** pantalla de canal cerrado clara; al abrirse, formulario compacto con estados de error, envío y éxito acordes con el sistema visual.

**Entrega:** ocho rutas públicas con un lenguaje común. **Cierre:** cada ruta tiene un estado vacío, de carga y de contenido comprensible; no hay UI que parezca accionable cuando no lo es.

### Fase 5 — Acabado accesible y movimiento

1. Comprobar foco visible, tabulación, lectura de menús y controles, zoom 200 % y zonas táctiles de al menos 44 × 44 px como objetivo de diseño.
2. Reducir desenfoques y entradas largas; usar animación breve para confirmar una acción o orientar un cambio de estado. Respetar `prefers-reduced-motion` en CSS y componentes Motion; [W3C explica esta técnica](https://www.w3.org/WAI/WCAG22/Techniques/css/C39).
3. Revisar el botón flotante de privacidad y cualquier otra superposición a 360, 390 y 430 px, incluidos teclados virtuales.
4. Validar contraste de tokens y de texto sobre fotografía; añadir fondo sólido o zona de lectura cuando la imagen no garantice contraste.

**Entrega:** matriz de revisión visual y accesibilidad. **Cierre:** no se ocultan mensajes por animación, superposición, tema o anchura.

### Fase 6 — Panel administrativo, por separado

El panel usa parte de los tokens globales pero cumple una tarea distinta. Después del sitio público se revisarán densidad, tablas, filtros, estados de guardado y alertas en `src/components/admin/`. El cambio de paleta compartida se comprobará inmediatamente en `/admin` para evitar regresiones; un rediseño completo del panel se planificará con capturas y flujos propios.

### Fase 7 — Control de calidad y entrega

1. Comparar capturas “antes/después” en 360, 390, 768, 1024 y 1440 px; claro y oscuro; con y sin movimiento reducido.
2. Revisar todos los estados: carga, sin datos, con datos, error, seleccionado, deshabilitado, hover y foco.
3. Ejecutar compilación y recorrido de las rutas públicas; corregir cualquier estilo roto por la migración.
4. Entregar inventario de componentes migrados, excepciones cromáticas, recursos pendientes de aprobación y capturas finales. El criterio final es coherencia observable, no una puntuación inventada de “lujo”.

## Orden recomendado y dependencias

`Referencia de marca → tokens y muestra de componentes → navegación y portada → páginas internas → tema oscuro y accesibilidad → panel administrativo → capturas finales`.

La presencia digital de Maresa Center permite orientar la interfaz hacia naranja y neutros. La certificación del HEX, el logotipo y las fotografías definitivas sigue dependiendo de recursos autorizados. No se deben cambiar contenidos comerciales ni datos de producto para que las pantallas parezcan completas.

## Avance de esta iteración

- Se retiró del sistema global la paleta azul/roja rechazada. La nueva base usa el naranja `#F7941D` observado en Maresa Center, superficies blancas y grises, y texto carbón. El panel no se rediseñó en esta fase, aunque comparte los tokens globales.
- El encabezado pasó a ser fijo dentro del flujo (`sticky`); el hero empieza debajo de él. Se eliminó la marquesina y las bandas de estadísticas del hero. La altura crece con el contenido en pantallas bajas.
- Se incorporaron dos imágenes generadas, sin marcas ni texto integrado, como recursos provisionales de escritorio y móvil. No son fotografías autorizadas por Maresa.
- Se ajustaron los CTA naranja a texto oscuro, se retiraron restos de azul en las agencias y en el mapa, y se cambió el favicon temporal por un pictograma de batería.
- Los heroes de Nosotros y Reciclaje ya usan imágenes sin pseudoidentidad ni rótulos generados. Reciclaje dejó de mostrar porcentajes, toneladas y cobertura no comprobados; ahora presenta cuatro pasos de manejo y entrega. El acceso persistente a preferencias de medición se ubicó después del pie para que no tape los CTA.
- Se comprobó visualmente la portada a 390 × 640 y 1280 × 800: el titular queda bajo el encabezado y los dos CTA permanecen visibles. La revisión del resto de rutas, estados, accesibilidad y marca autorizada permanece en el plan de fases.
