<!-- estado: "" -->
# UI System

Este documento describe los componentes visuales clave utilizados en el ecosistema de la web pública (EnergyEngine / Corporación Maresa).

## Radial Orbital Timeline (`radial-orbital-timeline.tsx`)

Este componente renderiza una línea de tiempo orbital y animada, diseñada bajo los principios de *Luxury UI* y *Generative Engine Optimization (GEO)*.

### Características Principales
- **Animación Continua (RequestAnimationFrame):** El componente rota 12.85 grados por segundo, logrando que cada tarjeta sea visible por exactamente 7 segundos en su fase activa, reemplazando temporizadores menos precisos.
- **Auto-Activación Matemática:** Determina el nodo activo calculando la distancia mínima respecto a los 0 grados (posición equivalente a las 3 en un reloj).
- **Consistencia Visual:** Las tarjetas de información poseen una altura estrictamente fijada (e.g. `h-[380px]` en escritorio y `h-[420px]` en móvil), evitando saltos de *layout shift (CLS)* durante la navegación.
- **Comportamiento Responsivo Avanzado:**
  - En versión de escritorio, el componente utiliza una estructura `flex-row` dividida en mitades.
  - En dispositivos móviles, la jerarquía visual se altera para mostrar el encabezado explicativo *antes* del carrusel orbital.
  - Implementa un "Auto-Scroll" semántico: al interactuar con un nodo en celular, la pantalla se desliza suavemente (`scrollIntoView`) hacia la tarjeta de información inferior para mejorar la UX y minimizar fricción.
  
### Dependencias
- `lucide-react` (iconografía semántica)
- Componentes base Shadcn UI (`Badge`, `Button`, `Card`)

### Mermaid Diagram de Interacción

```mermaid
graph TD
    A[Usuario o Auto-Rotación] -->|Selecciona Nodo| B(toggleItem)
    B --> C[Actualiza activeNodeId]
    B --> D[Calcula targetAngle]
    B --> E{Es Móvil? < 1024px}
    E -->|Sí| F[Auto-Scroll suave hacia cardRef]
    E -->|No| G[Sin scroll forzado]
    C --> H[Renderizado de activeItem Info Panel]
    D --> I[Rotación del Contenedor orbitRef]
```

## Relación con otros módulos
Ver también: [[01_Nosotros_Page]] | [[03_Agencias]] | [[AUDITORIA_2026-10-11]]

---

## Buscador Vehicular y Selectores de Lujo (`VehicleFinder.tsx` / `LuxuryDropdown`)

Diseñado bajo la directriz **Emil Kowalski Luxury UI** y **WCAG 2.2 AA**:

### Características Técnicas
- **Cero líneas nativas de OS:** Reemplazo de los tags `<select>` nativos por paneles flotantes con Glassmorphism y bordes sutiles adaptativos para modo claro/oscuro.
- **Micro-interacciones táctiles:** Feedback táctil instantáneo mediante `active:scale-[0.98]` y easings cubic-bezier `[0.23, 1, 0.32, 1]` a 180ms.
- **Navegación total por teclado:**
  - `ArrowDown` / `ArrowUp`: Navega y resalta opciones cíclicamente.
  - `Enter`: Selecciona la opción activa y repliega el menú.
  - `Escape`: Cierra el menú flotante sin perder el foco.
  - `scrollIntoView({ block: 'nearest' })`: Autoscroll accesible automático para mantener visible la opción enfocada.
- **Filtro predictivo inteligente:** Activo en marcas y modelos; deshabilitado en años (`hasSearch={false}`) para ofrecer una lista limpia cronológica sin inputs rotos.
- **Catálogo ecuatoriano integral:** Soporta marcas locales de alta rotación (Chevrolet, Toyota, Kia, Hyundai) y nuevas marcas líderes (BAIC, BYD, Changan, Chery, DFSK, Geely, Jetour, MG, Mitsubishi, etc.).

```mermaid
graph TD
    Trigger[Botón Trigger Luxury] -->|ArrowDown / Click| Menu[Panel Flotante Glassmorphism]
    Menu -->|Teclado ArrowUp / Down| Focus[Highlight Index + Auto-Scroll]
    Focus -->|Enter| Select[onSelect + Cierre Suave]
    Menu -->|Escape o Click Outside| Close[Cierre Seguro sin pérdida de estado]
```
