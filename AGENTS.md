<!-- estado: "" -->
# Coordinación de edición

Antes de editar un archivo de texto del proyecto, revisa su primera línea. Los archivos compatibles usan `estado: ""` cuando están libres y `estado: "en edición"` cuando otra IA los está modificando.

Para reservar un archivo libre, ejecuta `powershell -File scripts/edit-status.ps1 -Action acquire -Path "ruta/archivo"` y verifica el resultado. Si está ocupado, no lo modifiques. Al terminar y verificar tus cambios, ejecuta la misma orden con `-Action release`. Solo quien lo reservó debe liberarlo. Reserva archivos uno por uno y libera cada uno al terminar; no bloquees todo el proyecto.

`-Action check` consulta el estado y `-Action init` marca archivos compatibles sin estado. El script acepta código, reglas, Markdown y SVG. No agregues comentarios a JSON, archivos binarios, `.env`, `next-env.d.ts` ni archivos generados: sus formatos o ciclos de generación no permiten esta primera línea. La marca visible coordina a los agentes que respeten este protocolo; no reemplaza el bloqueo exclusivo que aplica el script durante cada cambio de estado.

Mantén separados los cambios del sitio público, el panel administrativo y el código compartido conforme a `ARCHITECTURE_MAP.md`. Antes de modificar la identidad visual, usa la referencia de marca aprobada; no deduzcas colores oficiales del nombre del proyecto.
