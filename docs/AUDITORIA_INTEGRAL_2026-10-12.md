# Auditoría integral actualizada — Baterías Maresa

**Fecha:** 12 de octubre de 2026. **Alcance:** código y servidor local de este repositorio, no el despliegue de Vercel ni la consola de Firebase. **Marca:** «Baterías Maresa» es provisional según el propietario; dominio, teléfonos, catálogo, precios, agencias, garantías y condiciones comerciales siguen pendientes de aprobación empresarial. **Veredicto:** la web funciona técnicamente, pero **no está lista para afirmar datos comerciales reales, habilitar indexación ni pagar publicidad**. La aprobación de Google Ads tampoco se puede garantizar desde una auditoría de código.

## Qué se verificó y qué falta

| Comprobación | Resultado | Límite |
|---|---|---|
| `npx tsc --noEmit` | Pasa | No comprueba comportamiento ni accesibilidad. |
| `npm run build` | Pasa; Next.js 15.5.27, 18 rutas generadas | No prueba el Firebase desplegado ni Web Vitals. |
| `npm audit --omit=dev --json` | 0 vulnerabilidades notificadas | Una base de datos de dependencias no es un pentest. |
| HTTP local `:3101` | 200 en portada, productos, agencias, nosotros, blog, B2B, privacidad, robots y sitemap | El servidor local usa configuración distinta a producción. |
| `GET /api/admin/users` anónimo | 403 | No demuestra que los demás flujos admin sean correctos. |
| HTML local | Portada con `noindex`, sin canonical ni JSON-LD; sitemap vacío; agencias contiene direcciones y WhatsApp de respaldo | El bloqueo de indexación es apropiado mientras falten datos oficiales. |
| Firebase configurado en `.env` | Lectura directa de Firestore verificada parcialmente | No se probaron cuentas autenticadas, creación, correo, Storage, App Check ni recuperación. |
| Accesibilidad, móvil y rendimiento | Medición parcial en Chrome local, 390 px móvil y 1350 px escritorio | Faltan lector de pantalla, teclado, zoom, Lighthouse y datos de campo. |

**Actualización de pruebas del 12 de octubre:** la configuración local se unificó en `.env`, excluido de Git. Se comprobó que Firebase Admin reconoce la cuenta de servicio del proyecto `maresa-project`, que el usuario existente tiene el correo verificado y que su perfil antiguo tenía rol `admin`. Se creó y leyó `usuarios/{uid}` con ese rol. El servidor local responde 403 ante un token inválido en `/api/admin/session` (ya no 503 por falta de configuración). No se ha probado todavía el inicio de sesión interactivo del usuario. `npx tsc --noEmit` y `npm run build` pasan con el `.env` único (18 rutas). La prueba de Lighthouse no arrancó porque el paquete no está disponible en la caché y el registro de npm está inaccesible en este entorno.

**Firestore, lectura real sin escribir datos:** usando las claves públicas de `.env` y forzando lectura del servidor, `site_content` devolvió 0 documentos, `distributors` 0 y `catalog` filtrado por `published == true` 0. Las consultas anónimas a un documento de `usuarios` y a `b2b_leads` fueron denegadas con `permission-denied`. Esto confirma que el contenido comercial de respaldo visto en local no proviene de esas colecciones del proyecto configurado. No prueba que Vercel use el mismo proyecto ni que todas las reglas estén desplegadas como en el repositorio.

**Incidente local resuelto:** `/admin` apareció sin estilos porque el servidor de desarrollo llevaba activo desde antes de una compilación que sobrescribió `.next`; su CSS solicitado devolvía 404. Se separó la salida de desarrollo en `.next-dev` (`next.config.ts`), se excluyó de Git y se incluyó su carpeta de tipos en `tsconfig.json`. Después de reiniciar, el CSS respondió 200; una nueva compilación de producción pasó con el servidor de desarrollo abierto y el CSS siguió respondiendo 200. Esto corrige la pérdida local de estilos; no cambia la necesidad de configurar Firebase Admin para iniciar sesión.

| Escenario Chrome local | LCP observado | CLS observado | Ancho horizontal | Controles sin nombre | H1 |
|---|---:|---:|---|---:|---:|
| Portada móvil, 390 px | 1,03–1,25 s en dos ejecuciones | 0 | Sin desbordamiento | 0 | 1 |
| Agencias móvil, 390 px | 0,23–0,24 s | 0 | Sin desbordamiento | 1 selector | 1 |
| Contacto B2B móvil, 390 px | 0,12 s | 0 | Sin desbordamiento | 3 selectores | **0** |
| Admin móvil, 390 px | 0,07 s | 0 | Sin desbordamiento | 0 | 1 |
| Portada escritorio, 1350 px | 0,65 s | 0 | Sin desbordamiento | 0 | 1 |

Estos valores son **una muestra local sin perfil de red/CPU de móvil ni usuarios reales**. No equivalen a puntuación Lighthouse, percentil 75 de Core Web Vitals, auditoría WCAG ni INP. El LCP muy bajo de algunas rutas puede corresponder a un bloque de texto y no prueba que mapas o datos de Firebase se hayan cargado correctamente.

**Puntuación honesta:** no asignar «10/10» a ninguna dimensión sin pruebas de aceptación. Los seis puntajes anteriores de 2/10, 3/10, 2/10, 2/10, 2/10 y 4/10 eran orientativos y ya no describen por sí solos el estado actual. Hay mejoras de base (compilación, UID, roles de servidor, `noindex` temporal), pero los bloqueos P0 siguientes impiden la salida comercial. Un 10/10 absoluto no es verificable; la meta operativa es cero bloqueos P0/P1, evidencia por criterio y monitoreo continuo.

## Bloqueos P0 — resolver antes de publicar o anunciar

### P0-1. Compatibilidad de vehículo y catálogo ficticio

**Evidencia:** `src/components/VehicleFinder.tsx:43,332-356` importa `vehicleCatalog` de `src/data/sinergiaData.ts` y lo deja visible si Firestore está vacío o falla. En `VehicleFinder.tsx:401-415`, si no encuentra año exacto, devuelve otra versión del mismo modelo; en `:703` declara «100% Calce Exacto Garantizado». `src/data/sinergiaData.ts:29-45` incluye batería «Andina Pro HD-27F Max», precio $145 y garantía de 24 meses. La página `/productos` afirma que los modelos, precios y garantías aún no están aprobados (`src/components/Products.tsx:249`).

**Impacto:** recomendación de batería potencialmente incompatible y comunicación comercial contradictoria. Una batería exige validar al menos dimensiones, caja, polaridad, terminales, capacidad, CCA, tecnología y requisitos de Start-Stop; marca/modelo/año por sí solos pueden ser insuficientes.

**Pasos para otra IA:**

1. Extraer el catálogo de ejemplo del flujo público; conservarlo solo como fixture de desarrollo claramente aislado si sirve para pruebas.
2. Iniciar el buscador con lista vacía y estado «catálogo pendiente»; jamás sustituir un error de Firestore con modelos/precios de demostración.
3. Exigir coincidencia exacta de la variante validada; si faltan motor, generación, año o tecnología, mostrar «requiere verificación humana» y un contacto aprobado. Eliminar la búsqueda por otro año.
4. Separar `published` de `verified`, con fuente, fecha de revisión, responsable y versión por referencia. Publicar solo registros aprobados.
5. Eliminar «100% Calce Exacto Garantizado», «base verificada» (`:545`) y descuentos (`:672`) hasta tener evidencia contractual y técnica.
6. Probar año inexistente, variante AGM/EFB, inversión de polaridad, catálogo vacío, caída de Firebase y ficha vigente. **Aceptación:** ningún caso devuelve un producto o precio no aprobado, ni presenta una aproximación como calce exacto.

### P0-2. Agencias, contactos y cobertura no confirmados

**Evidencia:** `src/lib/firebaseStore.ts:91-102` devuelve `defaultDistributors` cuando Firestore no trae agencias o falla. `src/components/StoreLocator.tsx:43,53-56` y `src/app/(site)/agencias/AgenciasClient.tsx:15,33-36` los muestran desde el primer render. `src/data/sinergiaData.ts:1868-2202` contiene direcciones, teléfonos y WhatsApp concretos. El HTML local de `/agencias` contiene una dirección de respaldo y el WhatsApp `593998123456`. `src/components/Header.tsx:230,316` muestra «1-800-BATERIA». El CMS muestra «cobertura nacional 24/7» (`src/context/SiteContentContext.tsx:239`).

**Pasos:** eliminar esos datos del render público; mostrar estado vacío útil; permitir publicación por agencia solo con dirección, coordenadas, horario, teléfono, enlace, autorización y fecha de verificación; auditar enlaces `tel:`, `wa.me` y rutas de mapa. **Aceptación:** con Firestore vacío o caído se ven cero agencias o teléfonos ficticios y un mensaje claro; cada agencia publicada tiene respaldo empresarial.

### P0-3. Beneficios, garantía y promesas sin respaldo

**Evidencia:** `src/context/SiteContentContext.tsx:230-242` activa por defecto instalación sin recargo, diagnóstico en 30 minutos, garantía de hasta 24 meses, descuento por canje, cobertura 24/7 y especialidad AGM/EFB. El HTML de portada sirve estas promesas. `src/components/VehicleFinder.tsx:672,759` también expone descuento y garantía. El pie, en cambio, llama al sitio «demostración» (`src/components/Footer.tsx`).

**Pasos:** inventariar toda promesa en portada, buscador, catálogo, blog, SEO, `llms.txt`, mapas y anuncios; vincular cada afirmación a una ficha aprobada con ámbito, excepciones y vigencia; sustituir ahora los importes, tiempos, garantías y cobertura por lenguaje neutral. **Aceptación:** una búsqueda de `24/7`, `gratis`, `100%`, `$`, «oficial», «garantizado» y teléfonos no descubre promesas sin fuente. Evitar datos estructurados que amplifiquen afirmaciones no aprobadas.

### P0-4. La identidad, privacidad y destino publicitario siguen provisionales

**Evidencia:** `src/app/(site)/privacidad/page.tsx` declara pendiente el responsable legal, canales y plazos de conservación. `.env` deja dominio y contactos vacíos. En local la portada emite `noindex` y el sitemap está vacío (`src/app/layout.tsx:17-28`, `src/app/sitemap.ts:7`). El formulario B2B recoge datos personales (`src/components/B2BLeadCapture.tsx` y `src/lib/firebaseStore.ts:36-55`).

**Pasos:** pedir a la empresa razón social/identidad autorizada, dominio, contactos reales, catálogo, agencias, ofertas, garantías, tratamiento de datos y responsable de consultas; aprobar una política de privacidad completa y el flujo de consentimiento/contacto conforme a la jurisdicción aplicable; verificar destino de cada anuncio y conversión. Solo después activar `SITE_URL` y `SITE_CONTENT_VERIFIED=true` y solicitar indexación. **Aceptación:** todas las páginas de destino presentan identidad coherente y datos comprobables, la política legal está aprobada y el anuncio coincide con la página. Google Ads decide la aprobación final.

## Prioridad P1 — seguridad, arquitectura y confianza

### P1-1. Formulario público expuesto a abuso y costo

`firestore.rules:25-47` permite crear `b2b_leads` sin sesión, App Check ni cuota por origen; valida algunos tamaños, pero no todos los campos, y no limita frecuencia. `src/lib/firebaseStore.ts:36-55` escribe directamente desde el navegador. Un atacante puede generar spam y costos de lectura/escritura.

**Pasos:** mover el alta a un endpoint servidor con validación de esquema estricta, control de tamaño, antispam y limitación de frecuencia/costo; aplicar App Check cuando se pruebe el cliente; dejar la regla de creación cliente cerrada si el servidor escribe con Admin SDK; registrar abuso y alertas de presupuesto. **Aceptación:** pruebas de ráfagas anónimas, payloads inválidos y replay son bloqueadas; una solicitud válida se guarda una sola vez.

### P1-2. Flujo de usuarios mejorado, pero pendiente de prueba real

**Hallazgo positivo:** `src/app/api/admin/users/route.ts:43-55` crea usuario de Authentication y documento `usuarios/{uid}`; `src/lib/adminAccess.ts:10-36` valida token, correo, usuario activo y rol; `firestore.rules:17-22` impide a clientes elevar roles. El alta usa contraseña aleatoria de 32 bytes y enlace al correo; no usa la cédula como clave. **Esta decisión es más segura:** la cédula es un dato personal predecible y no debe funcionar como contraseña. El nombre tampoco es un identificador único; usar correo + verificación/link y contraseña creada por el titular.

**Riesgos abiertos:** no se comprobó Firebase real ni despliegue de reglas; `src/components/admin/UsersManager.tsx:91-100` crea Auth/Firestore antes de enviar el enlace, de modo que el correo puede fallar y dejar una cuenta pendiente (la UI lo informa). `src/app/api/admin/change-password/route.ts:14-17` cambia Auth y luego Firestore en operaciones separadas; requiere prueba de falla parcial y recuperación. `src/lib/adminAccess.ts:18-30` mantiene un bootstrap por UID que debe retirarse tras migración. En `src/app/api/admin/users/[uid]/route.ts` solo hay PATCH de nombre/rol; verificar que la UI cubra desactivar/reactivar y revocar sesión cuando la operación sea necesaria.

**Pasos:** en un proyecto Firebase de pruebas desplegar reglas y crear admin/editor; enviar enlace, abrirlo en otro dispositivo, confirmar correo, crear clave, refrescar, cerrar/abrir sesión, editar rol, revocar acceso, probar error de correo y fallas entre Auth y Firestore. Comparar UID de Authentication con ID del documento. Verificar que editor no gestiona usuarios y que los cambios de rol tienen efecto inmediato. Retirar `FIREBASE_BOOTSTRAP_ADMIN_UID` al terminar migración. **Aceptación:** los datos sobreviven a recarga, el correo incorrecto no activa la cuenta, y no hay rol concedido por cliente.

### P1-3. Reglas y Storage no validados en el proyecto activo

`firestore.rules` y `storage.rules` están presentes y contienen controles útiles; que existan en Git no demuestra que estén desplegados. `site_content` permite a staff escribir un mapa libre (`firestore.rules:58-63`); conviene validar esquema, tamaño y URLs desde servidor o reglas más específicas. Storage limita tipo declarado y 5 MB (`storage.rules:14-19`); MIME declarado no demuestra contenido seguro. No se verificó IAM de la cuenta de servicio.

**Pasos:** registrar proyecto/ambiente de Firebase, desplegar reglas versionadas, usar Emulator Suite para casos permitidos y denegados, verificar App Check y cuotas, revisar IAM mínimo, escanear/transformar archivos antes de publicación si se habilitan subidas. **Aceptación:** matriz de permisos admin/editor/usuario/anon en Firestore y Storage pasa en emulador y en staging; producción coincide con la versión revisada.

### P1-4. CMS en cliente y contenido SEO inconsistente

`src/context/SiteContentContext.tsx:255-270` renderiza valores locales primero y consulta `site_content` desde el cliente después. El HTML inicial puede diferir del contenido aprobado en CMS; buscadores y asistentes pueden recibir texto obsoleto o incompleto. El `HomePage` completo es cliente (`src/app/(site)/page.tsx:18`).

**Pasos:** definir contenido público aprobado en servidor como fuente única, generarlo en HTML inicial y metadatos, cachear con invalidación al publicar; dejar interactividad en componentes cliente pequeños. Separar borrador/publicado y vista previa. **Aceptación:** `curl` sin JavaScript ve los mismos títulos, productos, agencias y respuestas que el usuario y el CMS publicado.

### P1-5. Seguridad HTTP y operabilidad incompletas

`next.config.ts:5-16` configura `nosniff`, Referrer-Policy, X-Frame-Options y Permissions-Policy, pero no CSP ni HSTS. No se ha probado su efecto en Vercel, ni registro de errores, alertas, respaldo/restauración o recuperación de datos. La ausencia de vulnerabilidades reportadas por `npm audit` no cubre lógica de autorización ni errores de configuración.

**Pasos:** diseñar CSP compatible con Next.js, Firebase, mapas e imágenes; introducirla primero en `Report-Only`, medir bloqueos y aplicar; comprobar HTTPS/HSTS en el dominio final; revisar secretos y permisos; instrumentar errores de cliente/servidor, métricas de formularios, presupuesto Firebase y Vercel; documentar respaldo y restauración. **Aceptación:** no hay fuentes inesperadas en CSP, alertas llegan a un responsable y se ejecuta una restauración de prueba.

## Prioridad P2 — calidad de experiencia, SEO y entrega

### P2-1. Rendimiento sin medición de campo

La compilación informa JS inicial aproximado de 358 kB en portada y 509 kB en `/admin`; el número por sí solo no mide experiencia. La muestra local de Chrome figura arriba; aún no mide INP ni condiciones de red/CPU de clientes. Hay una búsqueda con espera artificial de 500 ms (`VehicleFinder.tsx:397-423`) y muchas secciones cliente. **Medir** Lighthouse móvil/desktop y Web Vitals reales en las páginas clave; priorizar LCP, INP y CLS, rutas, imágenes, fuentes y terceros. Metas oficiales «buenas» en percentil 75: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Una meta interna más estricta se puede fijar después; TBT es métrica de laboratorio, no Core Web Vital. **Aceptación:** presupuesto de rendimiento en CI y datos de campo tras lanzar.

### P2-2. Accesibilidad y movimiento

`src/components/Marquee.tsx:24,53-79` repite cuatro veces el texto accesible; `src/app/globals.css:284-294` anima sin excepción visible de `prefers-reduced-motion`. El CMS tiene `speedSeconds:30` (`SiteContentContext.tsx:233`) pero CSS fija 60 s. Revisar además selector del vehículo, diálogos admin, foco, menús, mapa, contraste y zoom 200/400%.

La medición de Chrome identificó un `select` sin nombre accesible en `/agencias` y tres en `/contacto-b2b`: las etiquetas visibles no tienen `htmlFor`/`id` ni envuelven el control (`src/app/(site)/agencias/AgenciasClient.tsx:237-240`, `src/components/B2BLeadCapture.tsx:303-376`). La página B2B empieza con `h2` y no tiene `h1` (`src/components/B2BLeadCapture.tsx:116`). Asociar cada etiqueta al control y promover el título principal a `h1`, respetando la jerarquía de secciones. **Aceptación específica:** cero controles interactivos sin nombre en el árbol de accesibilidad y un H1 descriptivo en la página B2B.

**Pasos:** ocultar duplicados a tecnología asistiva o renderizar una sola lista accesible; ofrecer pausa y respetar movimiento reducido; usar la velocidad aprobada o eliminar control inoperante; auditar WCAG 2.2 AA con teclado, lector de pantalla, automatización y revisión manual. **Aceptación:** foco visible y orden lógico, anuncios sin repetición, animaciones pausables, formularios con errores anunciados, contraste y reflow conformes.

### P2-3. SEO técnico y visibilidad para IA condicionados a datos verificados

El `noindex` actual es correcto para una demo; en HTML local no hay canonical (sin `SITE_URL`) ni JSON-LD y el sitemap está vacío. `public/llms.txt` y `public/llms-full.txt` existen, pero no compensan páginas sin datos reales; tratarlos como resumen opcional y coherente, no como señal de posicionamiento garantizado.

**Pasos:** después de aprobar dominio/contenido, habilitar indexación, canonical y sitemap con solo páginas publicadas; crear metadatos únicos, enlaces internos y JSON-LD que refleje exclusivamente datos visibles/verificados (Organization, LocalBusiness por agencia real, Product solo con ficha aprobada, BreadcrumbList donde corresponda); validar Search Console y resultados enriquecidos. Redactar respuestas útiles para consultas de batería, CCA, AGM/EFB, mantenimiento, instalación, reciclaje y flotas con fuentes técnicas y fecha de revisión. **Aceptación:** Google puede rastrear páginas, no hay promesas falsas en schema/llms, y Search Console confirma cobertura sin errores críticos. Ningún `llms.txt` garantiza inclusión en respuestas de IA.

### P2-4. Contenido y conversión

La portada preserva secciones necesarias (buscador, catálogo, agencias, reciclaje, blog, B2B), pero combina contenido educativo prudente con afirmaciones comerciales ficticias. Hacer matriz por intención: conductor con batería fallando, comprador que compara, dueño de taller, flota/distribuidor. Para cada ruta: respuesta principal, evidencia, CTA real, disponibilidad/alcance, privacidad y siguiente paso. Publicar guías de diagnóstico con límites claros (evitar una compra errónea), tabla de tecnologías, criterios de compatibilidad y preguntas frecuentes. Medir llamadas/contactos válidos, no solo clics. **Aceptación:** pruebas con usuarios reales completan tareas clave sin depender de texto inventado.

### P2-5. Calidad de entrega y archivos

`package.json` tiene `lint: next lint`, sin configuración de ESLint ni scripts de pruebas detectados; la ejecución anterior de lint abrió configuración interactiva. No hay pruebas de reglas, autenticación, buscador o formularios. Hay comentarios de «ARCHITECTURE MAP» con líneas obsoletas en varios archivos. **Pasos:** configurar ESLint compatible con Next 15, `tsc`, pruebas unitarias de compatibilidad, emulador Firebase para reglas y flujo admin, pruebas E2E para ruta pública y onboarding, y CI que impida merge si falla. Corregir documentación de línea obsoleta. **Aceptación:** pipeline no interactivo con salida reproducible.

## Marco A+ específico para Baterías Maresa

| Dimensión | Evidencia exigida para aprobar |
|---|---|
| Identidad y veracidad | Nombre, datos de empresa, contactos, agencias, ofertas y garantía confirmados por responsable. |
| Seguridad y acceso | Autorización por servidor, roles mínimos, reglas desplegadas, pruebas negativas, App Check/cuotas, secretos y auditoría de cambios. |
| Exactitud automotriz | Fichas versionadas y verificadas, variante exacta, incertidumbre explícita, revisión humana cuando falten datos. |
| Privacidad y datos | Política aprobada, minimización, retención, derechos, acceso limitado y respaldo probado. |
| Arquitectura y fiabilidad | Fuente única de contenido publicado, fallas con estados honestos, despliegue reproducible y recuperación probada. |
| UX y accesibilidad | Tareas reales completadas en móvil, WCAG 2.2 AA, estados vacíos/error y navegación por teclado. |
| Rendimiento | LCP/INP/CLS medidos por página y dispositivo, con presupuestos y mejora continua. |
| SEO y GEO | HTML indexable cuando proceda, canonicals, sitemap, datos estructurados veraces, contenido de respuesta útil; presencia en IA medida, no prometida. |
| Conversión | CTAs funcionales, contactos reales, atribución de leads y seguimiento sin promesas no verificadas. |
| Observabilidad y calidad | CI, pruebas de negocio/seguridad, errores y costos monitorizados, incidentes y responsables definidos. |

## Orden de ejecución para otra IA

1. **Congelar contenido de ejemplo:** retirar catálogos, agencias, teléfonos y promesas de los renders públicos; conservar todas las secciones y estados vacíos.
2. **Corregir exactitud:** búsqueda exacta sin salto de año; ficha técnica verificada y proceso de aprobación.
3. **Cerrar abuso B2B y validar Firebase:** reglas, Auth, Storage, App Check, cuotas y onboarding en staging; documentar resultados con capturas y UID, sin exponer secretos.
4. **Recibir datos oficiales y aprobar privacidad:** identidad, dominio, catálogo, ubicaciones, precios, garantías y condiciones; revisar cada URL y CTA.
5. **Unificar publicación servidor/CMS:** HTML, metadata, canonical, sitemap, schema y archivos para IA desde la misma fuente aprobada.
6. **Medir y corregir experiencia:** móvil, teclado, WCAG 2.2 AA, Lighthouse y Core Web Vitals; pruebas de tareas con usuarios.
7. **Automatizar gates:** lint, typecheck, build, pruebas, emulador, E2E, seguridad de dependencias, monitoreo y restauración.
8. **Ensayo de salida:** validar despliegue real, Search Console, Analytics con consentimiento aplicable, formularios reales, teléfonos y campañas pequeñas; comprobar política publicitaria antes de escalar gasto.

**Criterio de publicidad:** no invertir aún. Levantar este bloqueo requiere P0 cerrados, privacidad aprobada, datos reales, formulario operable, sitio indexable si se busca SEO, y prueba del destino publicitario real. La política de Google Ads exige representación clara y no engañosa; la aprobación final depende de Google.

## Fuentes de criterios externos

- Google Ads, representación engañosa: https://support.google.com/adspolicy/answer/6020955
- Google Search, `noindex`: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google Search, datos estructurados: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Firebase, reglas de consultas: https://firebase.google.com/docs/firestore/security/rules-query
- Firebase, App Check: https://firebase.google.com/docs/app-check/enable-enforcement
- web.dev, Core Web Vitals: https://web.dev/articles/vitals
- W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/

## Limpieza realizada

Se eliminó `docs/AUDITORIA_2026-10-11.md` y se sustituyó por este informe. No se eliminaron scripts antiguos, `FIREBASE_SETUP.md` ni notas de otro agente: su uso y autoría necesitan inventario individual antes de borrarlos. El código y los datos del sitio no fueron modificados por esta auditoría.
