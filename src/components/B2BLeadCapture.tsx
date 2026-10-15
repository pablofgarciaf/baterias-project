// estado: ""
/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — B2BLeadCapture.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/B2BLeadCapture.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L024-L043  → Imports & dependencies
 *   L044-L056  → Component function start & initial form state
 *   L057-L065  → UI states (submission progress, success, error) & theme
 *   L066-L091  → Form submission handler (Firebase CRM integration)
 *   L093-L173  → JSX render: commercial proposition & distributor benefits
 *   L175-L431  → JSX render: B2B lead capture form & success feedback
 *   L433-L437  → Section close & component export end
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

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

export default function B2BLeadCapture({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? 'h1' : 'h2';
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
  const [consent, setConsent] = useState(false);

  const { content } = useSiteContent();
  const { theme } = useTheme();
  const b2b = content.b2b;
  const isDark = theme === 'dark';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!consent) {
      setErrorMsg('Debes aceptar el tratamiento de tus datos para enviar la postulación.');
      return;
    }
    setIsSubmitting(true);

    try {
      await submitB2BLead(formData);
      setIsSuccess(true);
      setConsent(false);
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
      className={`py-12 sm:py-16 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950/40 text-white border-slate-800' 
          : 'bg-gradient-to-br from-slate-50 via-white to-primary-50/50 text-slate-900 border-slate-200'
      }`}
    >
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Commercial Proposition */}
          <motion.div initial={{opacity: 0, filter: "blur(10px)", x: -20}} whileInView={{opacity: 1, filter: "blur(0px)", x: 0}} viewport={{once: true}} transition={{duration: 0.6}} className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/15 border border-primary-400/30 text-primary-600 dark:text-primary-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
              <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              {b2b.badge}
            </div>

            <Heading className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              {b2b.title}
            </Heading>

            <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {b2b.subtitle}
            </p>

            <div className="mt-8 space-y-4">
              {
                (b2b.benefits && b2b.benefits.length > 0 ? b2b.benefits : [
                  { icon: Percent, title: b2b.benefit1Title, desc: b2b.benefit1Desc },
                  { icon: Truck, title: b2b.benefit2Title, desc: b2b.benefit2Desc },
                  { icon: PackageCheck, title: b2b.benefit3Title, desc: b2b.benefit3Desc },
                  { icon: FileSpreadsheet, title: b2b.benefit4Title, desc: b2b.benefit4Desc }
                ]).map((item: any, idx: number) => {
                  const ItemIcon = item.icon || [Percent, Truck, PackageCheck, FileSpreadsheet][idx % 4];
                  return (
                  <motion.div 
                    initial={{opacity: 0, y: 15}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.4, delay: idx * 0.1}}
                    key={idx} 
                    className={`group flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-default ${
                      isDark 
                        ? 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 hover:bg-white/10' 
                        : 'bg-white border-slate-200 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5'
                    }`}
                  >
                  <div className="p-2.5 rounded-xl bg-primary-600/10 text-primary-600 dark:bg-white/10 dark:text-white shrink-0 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <ItemIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
                );
                })}
              </div>
          </motion.div>

          {/* Right Column: Lead Form */}
          <motion.div 
            initial={{opacity: 0, filter: "blur(10px)", x: 20}} 
            whileInView={{opacity: 1, filter: "blur(0px)", x: 0}} 
            viewport={{once: true}} 
            transition={{duration: 0.6, delay: 0.2}} 
            className="lg:col-span-7"
          >
            <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl border backdrop-blur-xl transition-colors ${
              isDark 
                ? 'bg-slate-900/50 border-white/10 text-white' 
                : 'bg-white/80 border-slate-200 text-slate-900 shadow-slate-900/10'
            }`}>
              
              {isSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ¡Solicitud Recibida con Éxito!
                  </h3>
                  <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Recibimos tu solicitud. Guarda el número de confirmación si aparece y espera la respuesta por el canal indicado.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 py-3 px-6 rounded-xl bg-secondary-500 hover:bg-secondary-400 text-primary-950 text-sm font-bold transition-all"
                  >
                    Enviar otra postulación
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <fieldset>
                  <div>
                    <h3 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      Formulario de Postulación de Distribuidor
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Déjanos los datos de tu empresa y nuestro equipo comercial te contactará.
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
                        aria-label="Negocio o razón social"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-primary-500'
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
                        aria-label="Nombre de contacto"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-primary-500'
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
                        aria-label="Correo electrónico"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-primary-500'
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
                        aria-label="Teléfono o WhatsApp"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-primary-500'
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
                        aria-label="Provincia"
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
                        aria-label="Ciudad o cantón"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-primary-500'
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
                        aria-label="Tipo de negocio"
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
                        aria-label="Volumen mensual estimado"
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
                      aria-label="Comentarios adicionales"
                      rows={1}
                      placeholder="Indícanos marcas con las que trabajas actualmente o requerimientos especiales..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none transition-all ${
                        isDark 
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-primary-500'
                      }`}
                    />
                  </div>

                  <label className={`flex items-start gap-2 text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#f7941d]"
                    />
                    <span>
                      Autorizo el tratamiento de mis datos para recibir información comercial, según la{' '}
                      <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="font-semibold underline">política de privacidad</a>.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || !consent}
                    className="w-full py-3 px-6 rounded-xl bg-secondary-500 hover:bg-secondary-400 text-primary-950 font-bold text-sm shadow-xl shadow-secondary-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Enviando...' : 'Enviar postulación'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
                    <span>Tus datos se usan solo para atender esta postulación comercial.</span>
                  </div>
                  </fieldset>
                </form>
              )}

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
