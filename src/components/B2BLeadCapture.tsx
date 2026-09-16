import { useState, FormEvent } from 'react';
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  PackageCheck, 
  Truck, 
  Percent, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { provinces } from '@/data/provinces';
import { submitB2BLead } from '@/lib/firebaseStore';
import { B2BLead } from '@/types/sinergia';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';

export default function B2BLeadCapture() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    province: 'Pichincha',
    city: '',
    businessType: 'Taller Mecánico' as B2BLead['businessType'],
    estimatedVolume: '10 - 30 unidades/mes',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { content } = useSiteContent();
  const { theme } = useTheme();
  const b2b = content.b2b;
  const isDark = theme === 'dark';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await submitB2BLead(formData);
      setIsSuccess(true);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        province: 'Pichincha',
        city: '',
        businessType: 'Taller Mecánico',
        estimatedVolume: '10 - 30 unidades/mes',
        notes: ''
      });
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Ocurrió un error al enviar la postulación. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="quiero-ser-proveedor" 
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 text-white border-slate-800' 
          : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/50 text-slate-900 border-slate-200'
      }`}
    >
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Commercial Proposition */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {b2b.badge}
            </div>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              {b2b.title}
            </h2>

            <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {b2b.subtitle}
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Percent,
                  title: b2b.benefit1Title,
                  desc: b2b.benefit1Desc
                },
                {
                  icon: Truck,
                  title: b2b.benefit2Title,
                  desc: b2b.benefit2Desc
                },
                {
                  icon: PackageCheck,
                  title: b2b.benefit3Title,
                  desc: b2b.benefit3Desc
                },
                {
                  icon: FileSpreadsheet,
                  title: b2b.benefit4Title,
                  desc: b2b.benefit4Desc
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
                    isDark 
                      ? 'bg-slate-900/70 border-slate-800 text-white' 
                      : 'bg-white border-slate-200 shadow-sm text-slate-900'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-blue-600/15 text-blue-600 dark:text-blue-400 shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-6">
            <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors ${
              isDark 
                ? 'bg-slate-900/90 border-slate-700 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-900/10'
            }`}>
              
              {isSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ¡Solicitud Recibida con Éxito!
                  </h3>
                  <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Tu postulación ha sido registrada en nuestro CRM Cloud de Maresa. Un asesor comercial corporativo se comunicará contigo en menos de 24 horas laborables.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all"
                  >
                    Enviar otra postulación
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      Formulario de Postulación de Distribuidor
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Completa los datos de tu empresa para acceder al catálogo mayorista oficial de Corporación Maresa.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Negocio / Razón Social *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Repuestos & Talleres Andinos"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Nombre de Contacto *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Ing. Juan Pérez"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="comercial@tunegocio.ec"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0991234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Provincia *
                      </label>
                      <select
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        {provinces.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Ciudad / Cantón *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Quito, Guayaquil, Cuenca"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Tipo de Negocio *
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value as B2BLead['businessType'] })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="Taller Mecánico">Taller Mecánico</option>
                        <option value="Distribuidor Mayorista">Distribuidor Mayorista</option>
                        <option value="Flota de Transporte">Flota de Transporte</option>
                        <option value="Empresa Industrial">Empresa Industrial</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Volumen Mensual Estimado
                      </label>
                      <select
                        value={formData.estimatedVolume}
                        onChange={(e) => setFormData({ ...formData, estimatedVolume: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="1 - 10 unidades/mes">1 - 10 unidades/mes</option>
                        <option value="10 - 30 unidades/mes">10 - 30 unidades/mes</option>
                        <option value="30 - 100 unidades/mes">30 - 100 unidades/mes</option>
                        <option value="Más de 100 unidades/mes">Más de 100 unidades/mes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Comentarios adicionales (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Indícanos marcas con las que trabajas actualmente o requerimientos especiales..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none transition-all ${
                        isDark 
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Registrando en CRM Maresa...' : 'Enviar Solicitud de Distribuidor'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Tus datos son tratados bajo estricta confidencialidad corporativa.</span>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
