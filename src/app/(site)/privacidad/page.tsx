// estado: ""
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Información de privacidad',
  description: 'Información provisional sobre los datos tratados en este sitio de demostración.',
  robots: { index: false, follow: false },
};

export default function PrivacidadPage() {
  return (
    <article className="container-max max-w-3xl py-16 space-y-6 text-slate-700 dark:text-slate-200">
      <h1 className="text-4xl font-bold">Información de privacidad</h1>
      <p>Este sitio está en preparación. La identidad legal del responsable y sus canales de contacto deben ser confirmados por la empresa antes del lanzamiento.</p>
      <h2 className="text-2xl font-semibold">Datos enviados por formularios</h2>
      <p>El formulario comercial permanece deshabilitado mientras se aprueban los datos legales y el canal de atención. No se aceptan nuevas solicitudes desde la página. Las solicitudes recibidas en etapas anteriores, si existen, se conservan en Firebase Firestore con acceso restringido a administradores hasta que el responsable determine su tratamiento y plazo de conservación.</p>
      <h2 className="text-2xl font-semibold">Acceso administrativo</h2>
      <p>Las cuentas autorizadas usan Firebase Authentication. Sus perfiles y roles se guardan en Firestore vinculados al UID de cada cuenta.</p>
      <h2 className="text-2xl font-semibold">Preferencias locales</h2>
      <p>El navegador puede guardar la preferencia de tema visual. No se utiliza para conceder acceso administrativo.</p>
      <h2 className="text-2xl font-semibold">Medición de visitas</h2>
      <p>Google Analytics 4 se carga solo si aceptas la medición. Puede recopilar las páginas visitadas y datos técnicos del dispositivo para elaborar estadísticas de uso. Puedes rechazarlo o cambiar tu elección con el botón «Privacidad y medición» del sitio. La preferencia se guarda en este navegador.</p>
      <p className="rounded-xl border border-warning-200 bg-warning-50 p-4 text-warning-950">La política legal definitiva, los plazos de conservación y el contacto para ejercer derechos deben ser aprobados por la empresa antes de publicar el sitio.</p>
    </article>
  );
}
