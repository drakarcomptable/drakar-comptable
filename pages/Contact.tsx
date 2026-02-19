
import React, { useState } from 'react';
import { Mail, Phone, Send, ShieldCheck, CheckCircle, Ship } from 'lucide-react';

const WEB3FORMS_KEY = 'efc6af61-d62e-4e0b-b4f5-e1e7907cb179';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append('access_key', WEB3FORMS_KEY);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        form.reset();
      } else {
        alert('Une erreur est survenue. Merci de réessayer ou de nous appeler directement.');
      }
    } catch {
      alert('Une erreur est survenue. Merci de réessayer ou de nous appeler directement.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-56 pb-40 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-green-100 p-10 rounded-full mb-10">
          <CheckCircle className="w-20 h-20 text-green-600" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-brand-blue mb-6 tracking-tighter leading-tight">C'est en route !</h1>
        <p className="text-2xl text-slate-600 max-w-xl mb-16 font-medium leading-relaxed">
          Merci pour votre confiance. Un expert Drakar étudie déjà votre dossier et reviendra vers vous sous 24h.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-brand-orange font-black text-lg hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <div className="pt-48 pb-32 bg-brand-slate/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Info Side */}
          <div className="space-y-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-blue text-brand-orange rounded-xl text-xs font-black tracking-[0.2em] uppercase">
                <Ship className="w-4 h-4" />
                Contact Direct
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-brand-blue tracking-tighter leading-tight">Parlons de votre gestion comptable.</h1>
              <p className="text-lg sm:text-2xl text-slate-600 font-medium leading-relaxed">
                Remplissez ce formulaire et recevez une offre Drakar sur-mesure pour la gestion structurée de votre entreprise.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="p-8 bg-white rounded-[40px] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-brand-slate w-14 h-14 rounded-2xl flex items-center justify-center text-brand-orange shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-brand-blue mb-1 uppercase tracking-tight">Appelez-nous</h3>
                  <p className="text-slate-500 font-bold">06 11 01 25 59</p>
                </div>
              </div>

              <div className="p-8 bg-white rounded-[40px] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-brand-slate w-14 h-14 rounded-2xl flex items-center justify-center text-brand-orange shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-brand-blue mb-1 uppercase tracking-tight">E-mail</h3>
                  <p className="text-slate-500 font-bold">contact@drakarexpertcomptable.fr</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-blue rounded-[40px] p-10 text-white flex items-center gap-8 shadow-2xl">
              <ShieldCheck className="w-16 h-16 text-brand-orange shrink-0" />
              <p className="text-lg text-slate-300 font-medium">
                Drakar protège vos données stratégiques. Toute demande est traitée avec une confidentialité absolue par nos experts.
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white rounded-[60px] p-12 lg:p-16 shadow-2xl border border-slate-100 relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">Nom & Prénom</label>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="Marc Morel"
                    className="w-full px-6 py-5 bg-brand-slate border-2 border-transparent focus:border-brand-orange rounded-2xl outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">E-mail Pro</label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="marc@startup.co"
                    className="w-full px-6 py-5 bg-brand-slate border-2 border-transparent focus:border-brand-orange rounded-2xl outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">Numéro de téléphone</label>
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="06 11 01 25 59"
                  className="w-full px-6 py-5 bg-brand-slate border-2 border-transparent focus:border-brand-orange rounded-2xl outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">Type de structure</label>
                <select
                  name="structure"
                  className="w-full px-6 py-5 bg-brand-slate border-2 border-transparent focus:border-brand-orange rounded-2xl outline-none transition-all appearance-none cursor-pointer font-bold"
                >
                  <option>SAS / SASU</option>
                  <option>SARL / EURL</option>
                  <option>SA</option>
                  <option>Profession Libérale</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">Votre défi comptable</label>
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Décrivez brièvement votre situation ou vos besoins spécifiques..."
                  className="w-full px-6 py-5 bg-brand-slate border-2 border-transparent focus:border-brand-orange rounded-2xl outline-none transition-all resize-none font-bold"
                ></textarea>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-orange text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-orange-500/40 hover:bg-brand-orange-hover transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? 'Envoi en cours...' : <><span>Envoyer à Drakar</span><Send className="w-6 h-6" /></>}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 font-medium">
                Réponse garantie en moins de 24h par un expert Drakar.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
